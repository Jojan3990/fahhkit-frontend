import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

const INSTAGRAM_URL = "https://www.instagram.com/fahhkit/";
const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/HZWIDpw5yJk70mxWej5M6q?mode=gi_t";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="FahhKit" className="footer-logo-img" />
            FahhKit
          </Link>
          <p>Getting it done is what we live by!</p>
          <div className="footer-social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="FahhKit on Instagram">
              <FaInstagram />
            </a>
            <a href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" aria-label="FahhKit WhatsApp community">
              <FaWhatsapp />
            </a>
          </div>
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
            <FaMapMarkerAlt /> Naxal, Kathmandu, Nepal
          </span>
          <span>
            <FaPhoneAlt /> +977-9813121465
          </span>
          <span>
            <FaEnvelope /> admin@cafebizarre.com.np
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-muted">© {new Date().getFullYear()} FahhKit. All rights reserved.</span>
      </div>
    </footer>
  );
}
