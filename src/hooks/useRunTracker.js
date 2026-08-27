import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MAX_ACCEPTABLE_ACCURACY_METERS,
  clearActiveRun,
  haversineDistance,
  loadActiveRun,
  saveActiveRun,
} from '../utils/run'
import { useWakeLock } from './useWakeLock'

// status: idle | tracking | permission-denied | unsupported | error
export function useRunTracker() {
  const [status, setStatus] = useState('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [distance, setDistance] = useState(0)

  const pointsRef = useRef([])
  const distanceRef = useRef(0)
  const watchIdRef = useRef(null)
  const timerRef = useRef(null)
  const startedAtRef = useRef(null)
  const fixCountRef = useRef(0)
  const lastAccuracyRef = useRef(null)
  const wakeLock = useWakeLock()

  const clearTimers = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    if (timerRef.current != null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Stops the browser-level watch/timer if the component unmounts mid-run
  // (e.g. SPA navigation away from the tracker) — the collected points stay
  // in localStorage either way, so reopening the tracker resumes from them.
  useEffect(() => clearTimers, [clearTimers])

  const beginWatch = useCallback(() => {
    setStatus('tracking')
    wakeLock.request()

    timerRef.current = setInterval(() => {
      setElapsedSeconds(
        Math.round((Date.now() - startedAtRef.current.getTime()) / 1000)
      )
    }, 1000)

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, altitude, accuracy, speed } =
          position.coords
        fixCountRef.current += 1
        lastAccuracyRef.current = accuracy ?? null
        if (accuracy != null && accuracy > MAX_ACCEPTABLE_ACCURACY_METERS)
          return

        const point = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy ?? null,
          timestamp: position.timestamp,
          speed: speed ?? null,
          elevation: altitude ?? null,
        }

        const previous = pointsRef.current[pointsRef.current.length - 1]
        pointsRef.current = [...pointsRef.current, point]
        if (previous) {
          distanceRef.current += haversineDistance(previous, point)
          setDistance(distanceRef.current)
        }

        saveActiveRun({
          startedAt: startedAtRef.current.toISOString(),
          points: pointsRef.current,
          distance: distanceRef.current,
        })
      },
      (err) => {
        clearTimers()
        wakeLock.release()
        setStatus(
          err.code === err.PERMISSION_DENIED ? 'permission-denied' : 'error'
        )
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    )
  }, [clearTimers, wakeLock])

  // Resumes a run that was already in progress when this component mounted —
  // covers a page refresh or the tracker being reopened after SPA navigation.
  useEffect(() => {
    const saved = loadActiveRun()
    if (!saved || !('geolocation' in navigator)) return

    pointsRef.current = saved.points || []
    distanceRef.current = saved.distance || 0
    startedAtRef.current = new Date(saved.startedAt)
    setDistance(distanceRef.current)
    setElapsedSeconds(
      Math.round((Date.now() - startedAtRef.current.getTime()) / 1000)
    )
    beginWatch()
    // Runs once on mount only — beginWatch is stable across the run's lifetime via its own deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      return
    }

    pointsRef.current = []
    distanceRef.current = 0
    fixCountRef.current = 0
    lastAccuracyRef.current = null
    setDistance(0)
    setElapsedSeconds(0)
    startedAtRef.current = new Date()

    saveActiveRun({
      startedAt: startedAtRef.current.toISOString(),
      points: [],
      distance: 0,
    })
    beginWatch()
  }, [beginWatch])

  const stop = useCallback(() => {
    clearTimers()
    wakeLock.release()
    setStatus('idle')
    clearActiveRun()

    const endedAt = new Date()
    const startedAt = startedAtRef.current ?? endedAt
    return {
      points: pointsRef.current,
      distance,
      duration: Math.round((endedAt - startedAt) / 1000),
      startedAt,
      endedAt,
      fixCount: fixCountRef.current,
      lastAccuracy: lastAccuracyRef.current,
    }
  }, [clearTimers, wakeLock, distance])

  return { status, elapsedSeconds, distance, start, stop }
}
