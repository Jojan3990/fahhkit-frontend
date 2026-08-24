import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, getJson } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HistoryList from "../components/HistoryList";
import "./HistoryPage.css";

export default function HistoryPage() {
  const { user, isAuthed, loading: userLoading } = useCurrentUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAthlete = user?.userType === "ATHLETE";

  useEffect(() => {
    if (userLoading || !isAuthed || !user?.id) {
      setLoading(false);
      return;
    }
    getJson(`/v1/athlete/${user.id}/history`)
      .then((data) => setHistory(data || []))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load your history. Please try again."))
      .finally(() => setLoading(false));
  }, [userLoading, isAuthed, user?.id]);

  return (
    <>
      <Navbar />
      <div className="history-page-wrap">
        <h1>History</h1>

        {!userLoading && !isAuthed && (
          <div className="banner error">
            <Link to="/login">Sign in</Link> to view your run history.
          </div>
        )}

        {!userLoading && isAuthed && !isAthlete && (
          <div className="banner error">Run history is only available for athlete accounts.</div>
        )}

        {isAuthed && isAthlete && error && <div className="banner error">{error}</div>}
        {isAuthed && isAthlete && loading && <p className="history-page-muted">Loading...</p>}

        {isAuthed && isAthlete && !loading && !error && (
          <HistoryList history={history} emptyMessage="You haven't registered for any events yet." />
        )}
      </div>
      <Footer />
    </>
  );
}
