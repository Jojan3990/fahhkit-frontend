import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ApiError, canManageEvents, getJson, postJson } from '../api/client'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { COUNTRIES_SORTED } from '../constants/countries'
import {
  NAME_PATTERN,
  NAME_TITLE,
  PHONE_PATTERN,
  PHONE_TITLE,
} from '../constants/validation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CreateModeratorPage.css'

export default function EditAthletePage() {
  const { userId } = useParams()
  const { user, loading: userLoading } = useCurrentUser()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [banner, setBanner] = useState(null)

  const allowed = canManageEvents(user)

  useEffect(() => {
    if (userLoading || !allowed) {
      setLoading(false)
      return
    }
    getJson(`/v1/user/${userId}/details`)
      .then((data) => {
        setForm({
          fullName: data.fullName || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          gender: data.gender || '',
          birthDate: data.birthDate || '',
          address: data.address || '',
          country: data.country || '',
          city: data.city || '',
          nationality: data.nationality || '',
          occupation: data.occupation || '',
          bloodGroup: data.bloodGroup || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactRelationship: data.emergencyContactRelationship || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
        })
      })
      .catch((err) =>
        setBanner({
          kind: 'error',
          message:
            err instanceof ApiError
              ? err.message
              : 'Could not load this athlete.',
        })
      )
      .finally(() => setLoading(false))
  }, [userId, userLoading, allowed])

  if (userLoading) {
    return (
      <div className="create-moderator-page">
        <Navbar />
        <div className="create-moderator-wrap">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!allowed) {
    return <Navigate to="/" replace />
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBanner(null)
    if (!e.target.reportValidity()) return

    setSubmitting(true)
    try {
      await postJson('/v1/athlete/update', { userId, ...form })
      navigate(`/athletes/${userId}`)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not update this athlete. Please try again.'
      setBanner({ kind: 'error', message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-moderator-page">
      <Navbar />
      <div className="create-moderator-wrap">
        <span className="blob auth-blob-a" aria-hidden="true" />
        <span className="blob auth-blob-b" aria-hidden="true" />
        <div className="create-moderator-inner">
          <header className="create-moderator-header" data-aos="fade-down">
            <h1>Edit Athlete</h1>
            <p>Update this athlete&apos;s details.</p>
          </header>

          {banner && (
            <div className={`banner ${banner.kind}`}>{banner.message}</div>
          )}
          {loading && <p>Loading...</p>}

          {!loading && form && (
            <form
              className="glass-card"
              onSubmit={handleSubmit}
              noValidate
              data-aos="fade-up"
            >
              <fieldset>
                <legend>Personal Details</legend>
                <div className="grid">
                  <div className="field full">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      pattern={NAME_PATTERN}
                      title={NAME_TITLE}
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      inputMode="numeric"
                      placeholder="98XXXXXXXX"
                      pattern={PHONE_PATTERN}
                      title={PHONE_TITLE}
                      value={form.mobileNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="gender">
                      Gender <span className="opt">(optional)</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="birthDate">
                      Date of Birth <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={form.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field full">
                    <label htmlFor="address">
                      Address <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Location &amp; Background</legend>
                <div className="grid">
                  <div className="field">
                    <label htmlFor="country">
                      Country <span className="opt">(optional)</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                    >
                      <option value="">Select country</option>
                      {COUNTRIES_SORTED.map(([code, label]) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="city">
                      City <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="nationality">
                      Nationality <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="nationality"
                      name="nationality"
                      type="text"
                      value={form.nationality}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="occupation">
                      Occupation <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="occupation"
                      name="occupation"
                      type="text"
                      value={form.occupation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="bloodGroup">
                      Blood Group <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="bloodGroup"
                      name="bloodGroup"
                      type="text"
                      placeholder="e.g. O+"
                      value={form.bloodGroup}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>
                  Emergency Contact <span className="opt">(optional)</span>
                </legend>
                <div className="grid">
                  <div className="field">
                    <label htmlFor="emergencyContactName">Contact Name</label>
                    <input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      type="text"
                      pattern={NAME_PATTERN}
                      title={NAME_TITLE}
                      value={form.emergencyContactName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="emergencyContactRelationship">
                      Relationship
                    </label>
                    <input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      type="text"
                      value={form.emergencyContactRelationship}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field full">
                    <label htmlFor="emergencyContactPhone">Contact Phone</label>
                    <input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="98XXXXXXXX"
                      pattern={PHONE_PATTERN}
                      title={PHONE_TITLE}
                      value={form.emergencyContactPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
