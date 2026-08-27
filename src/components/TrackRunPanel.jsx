/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useState } from 'react'
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
  const { status, elapsedSeconds, distance, start, stop } = useRunTracker()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [confirmingStop, setConfirmingStop] = useState(false)

  const pace = calculatePaceMinPerKm(distance, elapsedSeconds)
  const tracking = status === 'tracking'

  async function handleConfirmStop() {
    setConfirmingStop(false)
    const result = stop()
    if (result.points.length === 0) {
      if (result.fixCount === 0) {
        setSaveError(
          "Couldn't get a GPS fix in time. Make sure location services are on and try again."
        )
      } else {
        const accuracyText =
          result.lastAccuracy != null
            ? ` (accuracy was about ${Math.round(result.lastAccuracy)}m)`
            : ''
        setSaveError(
          `Your location signal was too weak to record this run${accuracyText}. GPS works best outdoors on a phone — laptops usually can't get an accurate fix.`
        )
      }
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const run = await createRun({
        points: result.points,
        distance: result.distance,
        duration: result.duration,
        startedAt: toLocalDateTimeString(result.startedAt),
        endedAt: toLocalDateTimeString(result.endedAt),
      })
      onSaved(run)
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : 'Could not save this run. Please try again.'
      )
      setSaving(false)
    }
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
      {saveError && <div className="banner error">{saveError}</div>}

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
