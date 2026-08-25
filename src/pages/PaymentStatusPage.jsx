import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ApiError, getJson, postJson } from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PaymentStatusPage.css";

const STATUS_CONTENT = {
  PAID: {
    kind: "success",
    title: "You're registered!",
    message: "Your payment was successful and your spot is confirmed.",
  },
  PENDING: {
    kind: "success",
    title: "Payment pending",
    message: "We're still confirming your payment with Khalti. This can take a moment — check back shortly.",
  },
  FAILED: {
    kind: "error",
    title: "Payment didn't go through",
    message: "Your payment could not be completed. You can try again below.",
  },
  CANCELLED: {
    kind: "error",
    title: "Payment cancelled",
    message: "You cancelled the payment before it completed. You can try again below.",
  },
};

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const registrationId = searchParams.get("registrationId");
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState(null);

  useEffect(() => {
    if (!registrationId) {
      setError("Missing registration details.");
      setLoading(false);
      return;
    }
    getJson(`/v1/event/registration/${registrationId}`)
      .then(setRegistration)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load your registration status."))
      .finally(() => setLoading(false));
  }, [registrationId]);

  async function handleRetry() {
    setRetryError(null);
    setRetrying(true);
    try {
      const data = await postJson(`/v1/event/registration/${registrationId}/initiate-payment`);
      window.location.href = data.paymentUrl;
    } catch (err) {
      setRetryError(err instanceof ApiError ? err.message : "Could not start payment. Please try again.");
      setRetrying(false);
    }
  }

  const content = registration ? STATUS_CONTENT[registration.paymentStatus] : null;

  return (
    <div className="payment-status-page">
      <Navbar />
      <div className="payment-status-wrap">
        <span className="blob auth-blob-a" aria-hidden="true" />
        <span className="blob auth-blob-b" aria-hidden="true" />
        <div className="payment-status-card glass-card" data-aos="fade-up">
          {loading && <p className="payment-status-muted">Checking your payment status...</p>}
          {error && <div className="banner error">{error}</div>}

          {!loading && registration && content && (
            <>
              <h1>{content.title}</h1>
              <p>{content.message}</p>

              <dl className="payment-status-meta">
                <div>
                  <dt>Event</dt>
                  <dd>{registration.eventName}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{registration.paymentStatus}</dd>
                </div>
              </dl>

              {retryError && <div className="banner error">{retryError}</div>}

              <div className="payment-status-actions">
                {(registration.paymentStatus === "FAILED" || registration.paymentStatus === "CANCELLED") && (
                  <button type="button" className="btn btn-primary" onClick={handleRetry} disabled={retrying}>
                    {retrying ? "Redirecting..." : "Try Payment Again"}
                  </button>
                )}
                <Link to={`/events/${registration.eventId}`} className="btn btn-outline">
                  View Event
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
