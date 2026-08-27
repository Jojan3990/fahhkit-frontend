import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, canManageEvents } from '../api/client'
import { getRuns } from '../api/runs'
import { useCurrentUser } from '../hooks/useCurrentUser'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RunThumbnailMap from '../components/RunThumbnailMap' // TEMP — testing only, remove when told to
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatRunDate,
} from '../utils/run'
import './RunsPage.css'

export default function RunsPage() {
  const { user, isAuthed, loading: userLoading } = useCurrentUser()
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // TEMP — staging restriction: run tracking limited to admin/moderator for now,
  // revert to `user?.userType === "ATHLETE"` when ready to launch to athletes
  const allowed = canManageEvents(user)

  useEffect(() => {
    if (userLoading || !isAuthed || !allowed) {
      setLoading(false)
      return
    }
    getRuns()
      .then((data) => setRuns(data || []))
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : 'Could not load your runs. Please try again.'
        )
      )
      .finally(() => setLoading(false))
  }, [userLoading, isAuthed, allowed])

  return (
    <div className="runs-page">
      <Navbar />
      <div className="runs-page-wrap">
        <header className="runs-page-header">
          <div>
            <h1>My Runs</h1>
            <p>Your tracked runs, most recent first.</p>
          </div>
          {allowed && (
            <Link to="/runs/track" className="btn btn-primary">
              Track a Run
            </Link>
          )}
        </header>

        {!userLoading && !isAuthed && (
          <div className="banner error">
            <Link to="/login">Sign in</Link> to view your runs.
          </div>
        )}

        {!userLoading && isAuthed && !allowed && (
          <div className="banner error">
            Run tracking is only available for admin/moderator accounts right
            now.
          </div>
        )}

        {isAuthed && allowed && error && (
          <div className="banner error">{error}</div>
        )}
        {isAuthed && allowed && loading && (
          <p className="runs-page-muted">Loading...</p>
        )}

        {isAuthed && allowed && !loading && !error && runs.length === 0 && (
          <p className="runs-page-muted">
            You haven&apos;t tracked any runs yet.
          </p>
        )}

        {isAuthed && allowed && !loading && !error && runs.length > 0 && (
          <div className="runs-list">
            {runs.map((run) => (
              <Link
                to={`/runs/${run.id}`}
                className="runs-list-item glass-card"
                key={run.id}
              >
                <RunThumbnailMap runId={run.id} />
                <div className="runs-list-item-main">
                  <span className="runs-list-item-date">
                    {formatRunDate(run.startedAt)}
                  </span>
                  <span className="runs-list-item-distance">
                    {formatDistance(run.distance)}
                  </span>
                </div>
                <dl className="runs-list-item-meta">
                  <div>
                    <dt>Duration</dt>
                    <dd>{formatDuration(run.duration)}</dd>
                  </div>
                  <div>
                    <dt>Pace</dt>
                    <dd>{formatPace(run.avgPace)}</dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
