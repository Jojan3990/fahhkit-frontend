import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, canManageEvents, getJson, resolveFileUrl } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EVENT_TYPE_LABELS, formatDate } from "../utils/events";
import "./EventsPage.css";

export default function EventsPage() {
  const { user } = useCurrentUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJson("/v1/event/upcoming")
      .then((data) => setEvents(data || []))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not load events. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="events-page">
      <Navbar />
      <div className="events-wrap">
        <header className="events-header" data-aos="fade-down">
          <div>
            <h1>Upcoming Events</h1>
            <p>Club races and community events on the calendar.</p>
          </div>
          {canManageEvents(user) && (
            <Link to="/events/create" className="btn btn-primary">
              Create Event
            </Link>
          )}
        </header>

        {error && <div className="banner error">{error}</div>}

        {loading && <p className="events-muted">Loading events...</p>}

        {!loading && !error && events.length === 0 && (
          <p className="events-muted">No upcoming events yet — check back soon.</p>
        )}

        <div className="events-grid">
          {events.map((event, i) => (
            <div className="event-card" key={event.id} data-aos="fade-up" data-aos-delay={(i % 3) * 100}>
              {event.eventImageUrl1 && (
                <div className="event-card-image-wrap">
                  <img src={resolveFileUrl(event.eventImageUrl1)} alt={event.name} className="event-card-image" />
                </div>
              )}
              <div className="event-card-body">
                <span className="event-card-type">{EVENT_TYPE_LABELS[event.type] || event.type}</span>
                <h3>{event.name}</h3>
                {event.description && <p className="event-card-description">{event.description}</p>}
                <dl className="event-card-meta">
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
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
