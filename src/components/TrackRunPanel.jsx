/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useState } from 'react'
import { FaExclamation, FaTimes } from 'react-icons/fa'
import { ApiError } from '../api/client'
import { createRun } from '../api/runs'
import { useRunTracker } from '../hooks/useRunTracker'
import {
  calculatePaceMinPerKm,
  formatDistance,
  formatDuration,
  formatPace,
  toLocalDateTimeString,
} from '../utils/run'
import './TrackRunPanel.css'

// The live-tracking widget itself (stats + start/stop), reused by both the
// dedicated /runs/track page and the full-screen live-event prompt.
export default function TrackRunPanel({ onSaved }) {
  const {
    status,
    elapsedSeconds,
    distance,
    start,
    stop,
    backgroundGapSeconds,
    dismissBackgroundGap,
    pendingRun,
    clearPendingRun,
  } = useRunTracker()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [confirmingStop, setConfirmingStop] = useState(false)

  const pace = calculatePaceMinPerKm(distance, elapsedSeconds)
  const tracking = status === 'tracking'

  async function attemptSave(run) {
    setSaving(true)
    setSaveError(null)
    try {
      const saved = await createRun({
        points: run.points,
        distance: run.distance,
        duration: run.duration,
        startedAt: toLocalDateTimeString(run.startedAt),
        endedAt: toLocalDateTimeString(run.endedAt),
      })
      clearPendingRun()
      onSaved(saved)
    } catch (err) {
      // Deliberately not clearing the pending run here — it stays in localStorage
      // (see useRunTracker) so "Retry Save" works even after closing the app,
      // e.g. if this failed because there was no connection at the time.
      setSaveError({
        title: "Couldn't save that",
        message:
          err instanceof ApiError
            ? err.message
            : 'Could not save this run. Please try again.',
      })
      setSaving(false)
    }
  }

  async function handleConfirmStop() {
    setConfirmingStop(false)
    const result = stop()
    if (result.points.length === 0) {
      if (result.fixCount === 0) {
        setSaveError({
          title: 'Nice try 👀',
          message:
            'We never actually found you out there. Did the run happen, or nah? Check your location is turned on and give it another go.',
        })
      } else {
        const accuracyText =
          result.lastAccuracy != null
            ? ` Signal was ~${Math.round(result.lastAccuracy)}m off — nowhere close.`
            : ''
        setSaveError({
          title: "That's sus 😏",
          message: `${accuracyText} Feels like laptop cardio, not the real thing. Grab your phone, get outside, and try again — GPS needs sky, not WiFi.`,
        })
      }
      return
    }
    await attemptSave(result)
  }

  function handleDiscardPending() {
    clearPendingRun()
    setSaveError(null)
  }

  return (
    <div className="track-run-panel">
      {status === 'permission-denied' && (
        <div className="banner error">
          Location access was denied. Enable location permissions for this site
          in your browser settings and try again.
        </div>
      )}
      {status === 'unsupported' && (
        <div className="banner error">
          Your browser doesn&apos;t support GPS tracking.
        </div>
      )}
      {status === 'error' && (
        <div className="banner error">
          Could not get your location. Please try again.
        </div>
      )}
      {saveError && (
        <div className="track-run-error">
          <span className="track-run-error-badge">
            <FaExclamation />
          </span>
          <div>
            <p className="track-run-error-title">{saveError.title}</p>
            <p className="track-run-error-message">{saveError.message}</p>
          </div>
        </div>
      )}

      {backgroundGapSeconds != null && (
        <div className="banner error track-run-gap-banner">
          <span>
            Your screen was off for about {formatDuration(backgroundGapSeconds)}{' '}
            — GPS tracking may have paused, so the route or distance could be
            missing that section.
          </span>
          <button
            type="button"
            onClick={dismissBackgroundGap}
            aria-label="Dismiss"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {pendingRun ? (
        <p className="track-run-hint">
          This run finished but hasn&apos;t been saved yet — it&apos;s kept on
          this device until it is.
        </p>
      ) : (
        <p className="track-run-hint">
          Keep your screen on during the run — locking it may pause GPS
          tracking.
        </p>
      )}

      <dl className="track-run-stats glass-card">
        <div>
          <dt>Time</dt>
          <dd>{formatDuration(elapsedSeconds)}</dd>
        </div>
        <div>
          <dt>Distance</dt>
          <dd>{formatDistance(distance)}</dd>
        </div>
        <div>
          <dt>Pace</dt>
          <dd>{formatPace(pace)}</dd>
        </div>
      </dl>

      <div className="track-run-actions">
        {tracking ? (
          confirmingStop ? (
            <>
              <p className="track-run-confirm-text">
                Stop this run? Your time and route will be saved.
              </p>
              <div className="track-run-confirm-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setConfirmingStop(false)}
                  disabled={saving}
                >
                  Keep Running
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmStop}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Yes, Stop'}
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setConfirmingStop(true)}
            >
              Stop Run
            </button>
          )
        ) : pendingRun ? (
          <>
            <p className="track-run-confirm-text">
              Your last run couldn&apos;t be saved. Retry now, or discard it?
            </p>
            <div className="track-run-confirm-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleDiscardPending}
                disabled={saving}
              >
                Discard
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => attemptSave(pendingRun)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Retry Save'}
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={start}
            disabled={saving}
          >
            Start Run
          </button>
        )}
      </div>
    </div>
  )
}
