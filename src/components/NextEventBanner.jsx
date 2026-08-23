/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { Link } from "react-router-dom";
import { EVENT_TYPE_LABELS, formatDate } from "../utils/events";
import { resolveFileUrl } from "../api/client";
import "./NextEventBanner.css";

function randomPhotoFor(event) {
  const seed = encodeURIComponent(event.id ?? event.name ?? "fahhkit-event");
  return `https://picsum.photos/seed/${seed}/1600/700`;
}

export default function NextEventBanner({ event }) {
  if (!event) return null;

  const image = event.eventImageUrl1 ? resolveFileUrl(event.eventImageUrl1) : randomPhotoFor(event);

  return (
    <section className="next-event-banner" data-aos="fade-down">
      <img src={image} alt="" className="next-event-bg" />
      <div className="next-event-scrim" />
      <div className="section-inner next-event-inner">
        <span className="next-event-tag">Next Up</span>
        <span className="next-event-type">{EVENT_TYPE_LABELS[event.type] || event.type}</span>
        <h2 className="next-event-title">{event.name}</h2>
        <p className="next-event-meta">
          {formatDate(event.date)}
          {event.venue ? ` · ${event.venue}` : ""}
        </p>
        <Link to="/events" className="btn btn-primary btn-lg">
          View Details
        </Link>
      </div>
    </section>
  );
}
