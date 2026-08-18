import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, canManageEvents, getJson, getToken, getUser } from "../api/client";
import Navbar from "../components/Navbar";
import "./EventsPage.css";

const EVENT_TYPE_LABELS = {
  ENDURANCE: "Endurance",
  STRENGTH: "Strength",
  HYBRID: "Hybrid",
  GYMNASTICS: "Gymnastics",
  COMBAT: "Combat",
  TEAM: "Team",
  RACKET: "Racket",
  OUTDOOR: "Outdoor",
  FLEXIBILITY: "Flexibility",
  PHYSIQUE: "Physique",
  RECREATIONAL: "Recreational",
};

function formatDate(value) {
  if (!value) return "TBA";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function EventsPage() {
  const isAuthed = Boolean(getToken());
  const user = getUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    getJson("/v1/event/upcoming")
      .then((data) => setEvents(data || []))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not load events. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [isAuthed]);

  return (
    <>
      <Navbar />
      <div className="events-wrap">
        <header className="events-header">
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

        {!isAuthed && (
          <div className="banner error">
            <Link to="/login">Sign in</Link> to view upcoming events.
          </div>
        )}

        {isAuthed && error && <div className="banner error">{error}</div>}

        {isAuthed && loading && <p className="events-muted">Loading events...</p>}

        {isAuthed && !loading && !error && events.length === 0 && (
          <p className="events-muted">No upcoming events yet — check back soon.</p>
        )}

        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              {event.eventImageUrl1 && <img src={event.eventImageUrl1} alt={event.name} className="event-card-image" />}
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
    </>
  );
}
