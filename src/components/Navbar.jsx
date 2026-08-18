import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { canManageEvents, clearToken, clearUser, getJson, getToken, getUser, setUser } from "../api/client";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setLocalUser] = useState(getUser());
  const navigate = useNavigate();
  const isAuthed = Boolean(getToken());

  useEffect(() => {
    if (isAuthed && !user) {
      getJson("/v1/user/find/logged-in")
        .then((data) => {
          setUser(data);
          setLocalUser(data);
        })
        .catch(() => {});
    }
  }, [isAuthed, user]);

  function close() {
    setOpen(false);
  }

  function handleSignOut() {
    clearToken();
    clearUser();
    close();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close}>
          <img src="/logo.png" alt="FahhKit" className="navbar-logo" />
          FahhKit Run Club
        </Link>

        <button
          className={`navbar-toggle ${open ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${open ? "open" : ""}`}>
          <a href="/#about" onClick={close}>
            About
          </a>
          <Link to="/events" onClick={close}>
            Events
          </Link>
          {isAuthed ? (
            <>
              {canManageEvents(user) && (
                <Link to="/events/create" className="btn btn-outline" onClick={close}>
                  Create Event
                </Link>
              )}
              {user?.fullName && <span className="navbar-username">Hi, {user.fullName}</span>}
              <button className="btn btn-outline" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" onClick={close}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={close}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
