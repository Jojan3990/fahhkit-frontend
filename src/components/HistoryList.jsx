/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { EVENT_TYPE_LABELS, formatDate } from "../utils/events";
import "./HistoryList.css";

const STATUS_LABELS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export default function HistoryList({ history, emptyMessage = "No run history yet." }) {
  if (!history || history.length === 0) {
    return <p className="history-empty">{emptyMessage}</p>;
  }

  return (
    <div className="history-list">
      {history.map((item) => (
        <div className="history-item" key={item.registrationId}>
          <div className="history-item-main">
            <span className="history-item-type">{EVENT_TYPE_LABELS[item.eventType] || item.eventType}</span>
            <h3>{item.eventName}</h3>
            <dl className="history-item-meta">
              <div>
                <dt>Event Date</dt>
                <dd>{formatDate(item.eventDate)}</dd>
              </div>
              {item.venue && (
                <div>
                  <dt>Venue</dt>
                  <dd>{item.venue}</dd>
                </div>
              )}
              <div>
                <dt>Registered On</dt>
                <dd>{formatDate(item.registeredDate)}</dd>
              </div>
            </dl>
          </div>
          <span className={`history-item-status status-${(item.eventStatus || "").toLowerCase()}`}>
            {STATUS_LABELS[item.eventStatus] || item.eventStatus}
          </span>
        </div>
      ))}
    </div>
  );
}
