import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { canManageEvents, clearToken, clearUser } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthed } = useCurrentUser();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    function onClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [userMenuOpen]);

  function close() {
    setOpen(false);
    setUserMenuOpen(false);
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
          FahhKit
        </Link>

        <div className="navbar-actions">
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
          {canManageEvents(user) && (
            <Link to="/athletes" onClick={close}>
              Athletes
            </Link>
          )}
          <Link to="/contact" onClick={close}>
            Contact
          </Link>
          {isAuthed ? (
            <div className="navbar-user-menu" ref={userMenuRef}>
              <button
                type="button"
                className="navbar-user-trigger"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <FaUserCircle className="navbar-user-icon" />
                {user?.fullName}
                <FaChevronDown className="navbar-user-caret" />
              </button>
              {userMenuOpen && (
                <div className="navbar-user-dropdown">
                  {user?.userType === "ATHLETE" && (
                    <Link to="/history" onClick={close}>
                      History
                    </Link>
                  )}
                  <Link to="/profile/edit" onClick={close}>
                    Edit Profile
                  </Link>
                  <button type="button" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
