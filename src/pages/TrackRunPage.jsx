import { Link, useNavigate } from 'react-router-dom'
import { canManageEvents } from '../api/client'
import { useCurrentUser } from '../hooks/useCurrentUser'
import TrackRunPanel from '../components/TrackRunPanel'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './TrackRunPage.css'

export default function TrackRunPage() {
  const { user, isAuthed, loading: userLoading } = useCurrentUser()
  const navigate = useNavigate()

  // TEMP — staging restriction: run tracking limited to admin/moderator for now,
  // revert to `user?.userType === "ATHLETE"` when ready to launch to athletes
  const allowed = canManageEvents(user)

  if (!userLoading && !isAuthed) {
    return (
      <div className="track-run-page">
        <Navbar />
        <div className="track-run-wrap">
          <div className="banner error">
            <Link to="/login">Sign in</Link> to track a run.
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!userLoading && !allowed) {
    return (
      <div className="track-run-page">
        <Navbar />
        <div className="track-run-wrap">
          <div className="banner error">
            Run tracking is only available for admin/moderator accounts right
            now.
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="track-run-page">
      <Navbar />
      <div className="track-run-wrap">
        <h1>Track a Run</h1>
        <TrackRunPanel onSaved={(run) => navigate(`/runs/${run.id}`)} />
      </div>
      <Footer />
    </div>
  )
}
