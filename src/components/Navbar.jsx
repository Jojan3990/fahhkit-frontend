import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { canManageEvents, clearToken, clearUser } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthed } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={close}>
          <img src="/logo.png" alt="FahhKit" className="navbar-logo" />
          FahhKit Run Club
        </Link>

        <div className="navbar-actions">
          <ThemeToggle />

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
        </div>

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
