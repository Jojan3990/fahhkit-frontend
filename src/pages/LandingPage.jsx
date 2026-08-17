import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import "./LandingPage.css";

const SLIDES = [
  {
    emoji: "🏃‍♂️",
    title: "Run With Purpose",
    subtitle: "Join a community of runners training for their next personal best.",
    gradient: "linear-gradient(135deg, #e8590c 0%, #ff8a3d 100%)",
    cta: (
      <Link to="/register" className="btn btn-white btn-lg">
        Join the Club
      </Link>
    ),
  },
  {
    emoji: "🏆",
    title: "Race Together",
    subtitle: "From 5Ks to marathons — we train, race, and celebrate as one team.",
    gradient: "linear-gradient(135deg, #c94a08 0%, #e8590c 100%)",
    cta: (
      <Link to="/register" className="btn btn-white btn-lg">
        Sign Up Free
      </Link>
    ),
  },
  {
    emoji: "🌄",
    title: "Every Route, Every Sunrise",
    subtitle: "Weekly group runs across the city's best trails and streets.",
    gradient: "linear-gradient(135deg, #23201d 0%, #756f68 100%)",
    cta: (
      <Link to="/register" className="btn btn-white btn-lg">
        Get Started
      </Link>
    ),
  },
  {
    emoji: "💪",
    title: "Train Smarter",
    subtitle: "Structured plans and coaching support to help you go the distance.",
    gradient: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
    cta: (
      <Link to="/register" className="btn btn-white btn-lg">
        Start Training
      </Link>
    ),
  },
];

const FEATURES = [
  { icon: "👟", title: "Group Runs", text: "Weekly runs for every pace, from beginners to seasoned racers." },
  { icon: "📅", title: "Events & Races", text: "Stay on top of upcoming club races and community events." },
  { icon: "📈", title: "Training Plans", text: "Structured guidance to help you build endurance and speed." },
  { icon: "🤝", title: "Real Community", text: "Meet runners who'll push you further and cheer you on." },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />

      <Carousel slides={SLIDES} />

      <section id="about" className="features">
        <div className="section-inner">
          <h2>Why Runners Choose FahhKit</h2>
          <p className="section-sub">Everything you need to lace up and show up, together.</p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="cta-band">
        <div className="section-inner cta-inner">
          <div>
            <h2>Ready to run with us?</h2>
            <p>Registration takes less than two minutes.</p>
          </div>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="section-inner footer-inner">
          <span>🏃 FahhKit Run Club</span>
          <span className="footer-muted">© {new Date().getFullYear()} FahhKit. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
