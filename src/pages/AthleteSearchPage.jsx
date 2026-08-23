import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { ApiError, canManageEvents, getJson } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Navbar from "../components/Navbar";
import "./AthleteSearchPage.css";

export default function AthleteSearchPage() {
  const { user, isAuthed, loading: userLoading } = useCurrentUser();
  const [athletes, setAthletes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allowed = isAuthed && canManageEvents(user);

  useEffect(() => {
    if (userLoading || !allowed) {
      setLoading(false);
      return;
    }
    getJson("/v1/athlete/find")
      .then((data) => setAthletes(data || []))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load athletes. Please try again."))
      .finally(() => setLoading(false));
  }, [userLoading, allowed]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return athletes;
    return athletes.filter((a) =>
      [a.fullName, a.email, a.mobileNumber].some((field) => field?.toLowerCase().includes(q))
    );
  }, [athletes, query]);

  if (!userLoading && !allowed) {
    return (
      <>
        <Navbar />
        <div className="athlete-search-wrap">
          <div className="banner error">
            {isAuthed ? "You don't have permission to view this page." : (
              <>
                <Link to="/login">Sign in</Link> as a moderator to search athletes.
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="athlete-search-wrap">
        <header className="athlete-search-header" data-aos="fade-down">
          <h1>Search Athletes</h1>
          <p>Find an athlete to view their profile and run history.</p>
        </header>

        <div className="athlete-search-box">
          <FaSearch className="athlete-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && <div className="banner error">{error}</div>}
        {loading && <p className="athlete-search-muted">Loading athletes...</p>}
        {!loading && !error && results.length === 0 && <p className="athlete-search-muted">No athletes found.</p>}

        <div className="athlete-search-list">
          {results.map((athlete) => (
            <Link to={`/athletes/${athlete.userId}`} className="athlete-search-card" key={athlete.userId}>
              <span className="athlete-search-avatar">{(athlete.fullName || "?").charAt(0).toUpperCase()}</span>
              <div>
                <h3>{athlete.fullName}</h3>
                <p>{athlete.email || athlete.mobileNumber}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
