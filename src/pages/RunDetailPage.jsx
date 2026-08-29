import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { deleteRun, getRun } from '../api/runs'
import RunMap from '../components/RunMap'
import ShareRunCarousel from '../components/ShareRunCarousel'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatRunDate,
} from '../utils/run'
import './RunDetailPage.css'

export default function RunDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [run, setRun] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getRun(id)
      .then(setRun)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : 'Could not load this run. Please try again.'
        )
      )
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteRun(id)
      navigate('/runs')
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : 'Could not delete this run. Please try again.'
      )
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  return (
    <div className="run-detail-page">
      <Navbar />
      <div className="run-detail-wrap">
        <Link to="/runs" className="run-detail-back-link">
          &larr; Back to My Runs
        </Link>

        {error && <div className="banner error">{error}</div>}
        {loading && <p className="run-detail-muted">Loading...</p>}

        {!loading && run && (
          <>
            <header className="run-detail-header">
              <h1>{formatRunDate(run.startedAt)}</h1>
            </header>

            <RunMap points={run.points} />

            <ShareRunCarousel run={run} />

            <dl className="run-detail-stats glass-card">
              <div>
                <dt>Distance</dt>
                <dd>{formatDistance(run.distance)}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(run.duration)}</dd>
              </div>
              <div>
                <dt>Avg Pace</dt>
                <dd>{formatPace(run.avgPace)}</dd>
              </div>
            </dl>

            {deleteError && <div className="banner error">{deleteError}</div>}

            <div className="run-detail-actions">
              {confirmingDelete ? (
                <>
                  <span className="run-detail-confirm-text">
                    Delete this run? This can&apos;t be undone.
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-danger-outline"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete Run
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
