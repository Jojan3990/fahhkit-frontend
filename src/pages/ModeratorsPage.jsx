import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { ApiError, isAdmin, postJson } from '../api/client'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { formatName } from '../utils/format'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ModeratorsPage.css'

export default function ModeratorsPage() {
  const { user, loading: userLoading } = useCurrentUser()
  const [moderators, setModerators] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [banner, setBanner] = useState(
    location.state?.message
      ? { kind: 'success', message: location.state.message }
      : null
  )

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!banner) return
    const timer = setTimeout(() => setBanner(null), 5000)
    return () => clearTimeout(timer)
  }, [banner])

  useEffect(() => {
    if (userLoading || !isAdmin(user)) {
      setLoading(false)
      return
    }
    postJson('/v1/user/moderator/find', { pageNumber: 1, noOfRecords: 500 })
      .then((data) => setModerators(data?.content || []))
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : 'Could not load moderators. Please try again.'
        )
      )
      .finally(() => setLoading(false))
  }, [userLoading, user])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return moderators
    return moderators.filter((m) =>
      [m.fullName, m.email, m.mobileNumber].some((field) =>
        field?.toLowerCase().includes(q)
      )
    )
  }, [moderators, query])

  if (userLoading) {
    return (
      <div className="moderators-page">
        <Navbar />
        <div className="moderators-wrap">
          <p className="moderators-muted">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAdmin(user)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="moderators-page">
      <Navbar />
      <div className="moderators-wrap">
        <header className="moderators-header" data-aos="fade-down">
          <div>
            <h1>Moderators</h1>
            <p>View, add, and edit moderator accounts.</p>
          </div>
          <Link to="/admin/create-moderator" className="btn btn-primary">
            Add Moderator
          </Link>
        </header>

        {banner && (
          <div className={`banner ${banner.kind}`}>{banner.message}</div>
        )}

        <div className="moderators-search-box">
          <FaSearch className="moderators-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && <div className="banner error">{error}</div>}
        {loading && <p className="moderators-muted">Loading moderators...</p>}
        {!loading && !error && results.length === 0 && (
          <p className="moderators-muted">No moderators found.</p>
        )}

        <div className="moderators-list">
          {results.map((moderator) => (
            <Link
              to={`/admin/moderators/${moderator.id}/edit`}
              className="moderator-card"
              key={moderator.id}
            >
              <span className="moderator-avatar">
                {(moderator.fullName || '?').charAt(0).toUpperCase()}
              </span>
              <div className="moderator-info">
                <span className="moderator-name">
                  {formatName(moderator.fullName)}
                </span>
                <span className="moderator-meta">{moderator.email}</span>
                <span className="moderator-meta">{moderator.mobileNumber}</span>
              </div>
              <span
                className={`moderator-status ${moderator.status === 'LOCKED' ? 'inactive' : 'active'}`}
              >
                {moderator.status === 'LOCKED' ? 'Disabled' : 'Active'}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
