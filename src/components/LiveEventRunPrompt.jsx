import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useLiveRegisteredEvent } from '../hooks/useLiveRegisteredEvent'
import { loadTrackedEventIds, saveTrackedEventIds } from '../utils/run'
import TrackRunPanel from './TrackRunPanel'
import './LiveEventRunPrompt.css'

// Mounted once at the app root. While the user has a PAID registration for an
// event that started within the last hour, this takes over the screen with
// the run tracker so they don't have to go find /runs/track themselves.
export default function LiveEventRunPrompt() {
  const liveEvent = useLiveRegisteredEvent()
  const { user } = useCurrentUser()
  const [dismissed, setDismissed] = useState(false)
  const [trackedEventIds, setTrackedEventIds] = useState(() => new Set())
  const location = useLocation()
  const navigate = useNavigate()

  // Persists which events this athlete already tracked, so a refresh within
  // the same 1-hour window doesn't re-show the prompt. Same-device-only
  // stopgap — see loadTrackedEventIds in utils/run.js for why.
  useEffect(() => {
    if (!user?.id) return
    setTrackedEventIds(new Set(loadTrackedEventIds(user.id)))
  }, [user?.id])

  // A close click only skips the prompt for the page the user is currently
  // on — navigating anywhere else brings it back for the rest of the hour.
  useEffect(() => {
    setDismissed(false)
  }, [location.pathname])

  const onTrackPage = location.pathname === '/runs/track'

  if (
    !liveEvent ||
    dismissed ||
    onTrackPage ||
    trackedEventIds.has(liveEvent.eventId)
  ) {
    return null
  }

  function handleSaved(run) {
    setTrackedEventIds((prev) => {
      const next = new Set(prev).add(liveEvent.eventId)
      if (user?.id) saveTrackedEventIds(user.id, next)
      return next
    })
    navigate(`/runs/${run.id}`)
  }

  return (
    <div className="live-event-prompt">
      <div className="live-event-prompt-panel glass-card">
        <button
          type="button"
          className="live-event-prompt-close"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
        >
          <FaTimes />
        </button>
        <span className="live-event-prompt-badge">Live Now</span>
        <h1>{liveEvent.eventName}</h1>
        <p className="live-event-prompt-subtitle">
          This event just started — track your run.
        </p>
        <TrackRunPanel onSaved={handleSaved} />
      </div>
    </div>
  )
}
