import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ApiError, canManageEvents, getJson } from '../api/client'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { formatName } from '../utils/format'
import { formatDate } from '../utils/events'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './EventRegistrantsPage.css'

const STATUS_LABELS = {
  PAID: 'Paid',
  PENDING: 'Pending',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
}

export default function EventRegistrantsPage() {
  const { id } = useParams()
  const { user, loading: userLoading } = useCurrentUser()
  const [event, setEvent] = useState(null)
  const [registrants, setRegistrants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const allowed = canManageEvents(user)

  useEffect(() => {
    if (userLoading || !allowed) {
      setLoading(false)
      return
    }
    Promise.all([
      getJson(`/v1/event/${id}`),
      getJson(`/v1/event/${id}/registrations`),
      getJson('/v1/athlete/find'),
    ])
      .then(([eventData, registrantsData, athletesData]) => {
        setEvent(eventData)
        // Only athletes can be applicants for an event — admins/moderators are excluded
        // even if one of them happens to have a registration row.
        const athleteById = new Map(
          (athletesData || []).map((a) => [a.userId, a])
        )
        const applicants = (registrantsData || [])
          .filter((r) => athleteById.has(r.userId))
          .map((r) => ({
            ...r,
            mobileNumber: athleteById.get(r.userId).mobileNumber,
          }))
        setRegistrants(applicants)
      })
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : 'Could not load registrants. Please try again.'
        )
      )
      .finally(() => setLoading(false))
  }, [id, userLoading, allowed])

  if (userLoading) {
    return (
      <div className="event-registrants-page">
        <Navbar />
        <div className="event-registrants-wrap">
          <p className="event-registrants-muted">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!allowed) {
    return <Navigate to={`/events/${id}`} replace />
  }

  return (
    <div className="event-registrants-page">
      <Navbar />
      <div className="event-registrants-wrap">
        <p className="event-registrants-back">
          <Link to={`/events/${id}`}>&larr; Back to event</Link>
        </p>

        <header className="event-registrants-header" data-aos="fade-down">
          <h1>Applicants{event ? ` — ${event.name}` : ''}</h1>
          <p>Everyone who&apos;s registered for this event.</p>
        </header>

        {error && <div className="banner error">{error}</div>}
        {loading && <p className="event-registrants-muted">Loading...</p>}
        {!loading && !error && registrants.length === 0 && (
          <p className="event-registrants-muted">
            No one has registered for this event yet.
          </p>
        )}

        {!loading && !error && registrants.length > 0 && (
          <div className="registrant-table-wrap">
            <table className="registrant-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Payment Status</th>
                  <th>Registered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {registrants.map((registrant) => (
                  <tr key={registrant.registrationId}>
                    <td className="registrant-name-cell">
                      {formatName(registrant.fullName)}
                    </td>
                    <td>{registrant.mobileNumber || '—'}</td>
                    <td>
                      <span
                        className={`registrant-status status-${(registrant.paymentStatus || '').toLowerCase()}`}
                      >
                        {STATUS_LABELS[registrant.paymentStatus] ||
                          registrant.paymentStatus}
                      </span>
                    </td>
                    <td className="registrant-meta-cell">
                      {formatDate(registrant.registeredDate)}
                    </td>
                    <td>
                      <Link
                        to={`/athletes/${registrant.userId}`}
                        className="btn btn-outline"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
