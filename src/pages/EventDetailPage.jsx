import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, getJson, postJson, resolveFileUrl } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRegisteredEventIds } from "../hooks/useRegisteredEvents";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import { EVENT_TYPE_LABELS, formatDate } from "../utils/events";
import "./EventDetailPage.css";

const PAYMENT_STATUS_LABELS = {
  PENDING: "Payment Pending",
  PAID: "Paid",
  FAILED: "Payment Failed",
  CANCELLED: "Cancelled",
};

export default function EventDetailPage() {
  const { id } = useParams();
  const { isAuthed, loading: userLoading } = useCurrentUser();
  const registeredIds = useRegisteredEventIds();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    getJson(`/v1/event/${id}`)
      .then(setEvent)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load this event. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRegister() {
    setRegisterError(null);
    setRegistering(true);
    try {
      const data = await postJson(`/v1/event/${id}/register`);
      setRegistration(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not complete registration. Please try again.";
      if (!message.toLowerCase().includes("already registered")) {
        setRegisterError(message);
      }
    } finally {
      setRegistering(false);
    }
  }

  const images = event ? [event.eventImageUrl1, event.eventImageUrl2, event.eventImageUrl3].filter(Boolean) : [];
  const closed = event?.status === "CANCELLED" || event?.status === "COMPLETED";
  const deadlinePassed = Boolean(event?.registrationDeadline) && new Date(event.registrationDeadline) < new Date();
  const alreadyRegistered = Boolean(registration) || registeredIds.has(id);

  return (
    <div className="event-detail-page">
      <Navbar />
      <div className="event-detail-top">
        <p className="event-detail-back">
          <Link to="/events">&larr; Back to Events</Link>
        </p>

        {error && <div className="banner error">{error}</div>}
        {loading && <p className="event-detail-muted">Loading...</p>}
      </div>

      {!loading && event && (
        <>
          {images.length > 0 ? (
            <div className="event-detail-gallery">
              <Carousel
                slides={images.map((img) => ({ image: resolveFileUrl(img), content: <></> }))}
                intervalMs={7000}
              />
            </div>
          ) : (
            <div className="event-detail-gallery event-detail-gallery-empty" aria-hidden="true" />
          )}

          <div className="event-detail-wrap">
            <div className="event-detail-body">
              <div className="event-detail-main glass-card" data-aos="fade-up">
                <span className="event-card-type">{EVENT_TYPE_LABELS[event.type] || event.type}</span>
                <h1>{event.name}</h1>
                {event.description && <p className="event-detail-description">{event.description}</p>}

                <dl className="event-detail-meta">
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDate(event.date)}</dd>
                  </div>
                  {event.venue && (
                    <div>
                      <dt>Venue</dt>
                      <dd>{event.venue}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Entry Fee</dt>
                    <dd>{Number(event.entryFee) > 0 ? event.entryFee : "Free"}</dd>
                  </div>
                  {event.capacity != null && (
                    <div>
                      <dt>Capacity</dt>
                      <dd>{event.capacity}</dd>
                    </div>
                  )}
                  {event.registrationDeadline && (
                    <div>
                      <dt>Registration Deadline</dt>
                      <dd>{formatDate(event.registrationDeadline)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <aside className="event-detail-register glass-card" data-aos="fade-up" data-aos-delay="100">
                <h2>Registration</h2>

                {alreadyRegistered ? (
                  <div className="event-detail-registered">
                    <p className="event-detail-registered-title">You&apos;re registered!</p>
                    {registration && (
                      <dl>
                        <div>
                          <dt>Status</dt>
                          <dd>{PAYMENT_STATUS_LABELS[registration.paymentStatus] || registration.paymentStatus}</dd>
                        </div>
                        {registration.registrationId && (
                          <div>
                            <dt>Registration ID</dt>
                            <dd>{registration.registrationId}</dd>
                          </div>
                        )}
                      </dl>
                    )}
                    {registration?.paymentStatus === "PENDING" && Number(event.entryFee) > 0 && (
                      <p className="event-detail-registered-note">
                        Your spot is reserved — payment confirmation is still pending.
                      </p>
                    )}
                  </div>
                ) : closed ? (
                  <p className="event-detail-muted">
                    {event.status === "CANCELLED" ? "This event has been cancelled." : "This event has already taken place."}
                  </p>
                ) : deadlinePassed ? (
                  <p className="event-detail-muted">Registration for this event has closed.</p>
                ) : userLoading ? (
                  <p className="event-detail-muted">Loading...</p>
                ) : isAuthed ? (
                  <>
                    {registerError && <div className="banner error">{registerError}</div>}
                    <button type="button" className="btn btn-primary btn-block" onClick={handleRegister} disabled={registering}>
                      {registering ? "Registering..." : "Register for this Event"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="event-detail-muted">Sign up for a FahhKit account to register for this event.</p>
                    <Link to="/register" className="btn btn-primary btn-block">
                      Sign Up to Register
                    </Link>
                  </>
                )}
              </aside>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
