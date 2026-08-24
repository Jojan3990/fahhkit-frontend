import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">
            <img src="/logo.png" alt="FahhKit" className="footer-logo-img" />
            FahhKit
          </span>
          <p>Getting it done is what we live by!</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="/#about">About</a>
          <Link to="/events">Events</Link>
          <Link to="/register">Join the Club</Link>
        </div>

        <div className="footer-col footer-contact">
          <h4>Contact</h4>
          <span>
            <FaMapMarkerAlt /> Kathmandu, Nepal
          </span>
          <span>
            <FaPhoneAlt /> +977-98XXXXXXXX
          </span>
          <span>
            <FaEnvelope /> hello@fahhkit.com
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-muted">© {new Date().getFullYear()} FahhKit. All rights reserved.</span>
      </div>
    </footer>
  );
}
