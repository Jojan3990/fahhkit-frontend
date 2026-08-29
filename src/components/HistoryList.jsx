/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { EVENT_TYPE_LABELS, formatDate } from '../utils/events'
import './HistoryList.css'

const STATUS_LABELS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
}

const PAYMENT_STATUS_LABELS = {
  PAID: 'Payment Paid',
  PENDING: 'Payment Pending',
}

// Free/no-fee events never get a payment record, so a missing paymentStatus
// is treated as visible too — only a failed/cancelled payment hides an entry.
function isVisible(item) {
  return (
    !item.paymentStatus ||
    item.paymentStatus === 'PAID' ||
    item.paymentStatus === 'PENDING'
  )
}

export default function HistoryList({
  history,
  emptyMessage = 'No run history yet.',
}) {
  const visibleHistory = (history || []).filter(isVisible)

  if (visibleHistory.length === 0) {
    return <p className="history-empty">{emptyMessage}</p>
  }

  return (
    <div className="history-list">
      {visibleHistory.map((item) => (
        <div className="history-item" key={item.registrationId}>
          <div className="history-item-main">
            <span className="history-item-type">
              {EVENT_TYPE_LABELS[item.eventType] || item.eventType}
            </span>
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
          <div className="history-item-badges">
            <span
              className={`history-item-status status-${(item.eventStatus || '').toLowerCase()}`}
            >
              {STATUS_LABELS[item.eventStatus] || item.eventStatus}
            </span>
            {item.paymentStatus && (
              <span
                className={`history-item-payment payment-${item.paymentStatus.toLowerCase()}`}
              >
                {PAYMENT_STATUS_LABELS[item.paymentStatus] ||
                  item.paymentStatus}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
