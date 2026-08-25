import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import SectionTitle from "../components/SectionTitle";
import { eventToSlide } from "../components/NextEventBanner";
import SponsorCarousel from "../components/SponsorCarousel";
import TeamCarousel from "../components/TeamCarousel";
import Footer from "../components/Footer";
import { getJson } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import bannerImage from "../assets/images/Fahhkit-Banner.jfif";
import sundayRundayImage from "../assets/images/Sunday-Runday.jfif";
import foundingMembersImage from "../assets/images/founding-members.jfif";
import manojBasnetPhoto from "../assets/images/team/manojbasnet.jfif";
import aryanDahalPhoto from "../assets/images/team/aryandahal.jfif";
import aryanShahPhoto from "../assets/images/team/aryanshah.jfif";
import "./LandingPage.css";

const SLIDES = [
  {
    image: bannerImage,
    title: "Fahhkit Fitness Club",
    subtitle: "Say f**k it and get it done!",
    cta: (
      <Link to="/register" className="btn btn-white btn-lg">
        Join the Club
      </Link>
    ),
  },
  {
    image: sundayRundayImage,
    title: "Sunday Runday",
    subtitle: "Happens every Sunday at 5pm, Cafe Bizarre",
    cta: (
      <Link to="/events" className="btn btn-white btn-lg">
        View Events
      </Link>
    ),
  },
];

const MILESTONES = [
  { number: "150+", label: "Members Joined" },
  { number: "2+", label: "Events Hosted" },
  { number: "1K+", label: "KM Logged Together" },
  { number: "3", label: "Months Running Strong" },
];

const TEAM = [
  {
    name: "Manoj Basnet",
    role: "Founder & Head Coach",
    photo: manojBasnetPhoto,
    bio: "Started FahhKit with a single Sunday run and hasn't missed one since. Believes every workout should feel like showing up for your friends.",
  },
  {
    name: "Aryan Dahal",
    role: "Run Coach",
    photo: aryanDahalPhoto,
    bio: "Plans the routes, sets the pace, and makes sure nobody gets left behind — literally or figuratively.",
  },
  {
    name: "Aryan Shah",
    role: "Community Lead",
    photo: aryanShahPhoto,
    bio: "The friendly face who welcomes every new member and keeps the group chat alive between events.",
  },
  {
    name: "Aryan Dahal",
    role: "Events Coordinator",
    photo: aryanDahalPhoto,
    bio: "Turns \"say fk it\" into an actual race day — venues, logistics, and snacks all sorted.",
  },
];

export default function LandingPage() {
  const { isAuthed } = useCurrentUser();
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(location.state?.message ? { kind: "success", message: location.state.message } : null);

  useEffect(() => {
    getJson("/v1/event/upcoming")
      .then((data) => setEvents((data || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(timer);
  }, [banner]);

  const slides = [...events.map((event, i) => eventToSlide(event, i === 0)), ...SLIDES];

  return (
    <div className="landing">
      <Navbar />

      {banner && (
        <div className="section-inner">
          <div className={`banner ${banner.kind}`}>{banner.message}</div>
        </div>
      )}

      <Carousel slides={slides} />

      <SponsorCarousel />

      <section id="about" className="milestones">
        <div className="section-inner milestones-inner">
          <div className="milestones-content" data-aos="fade-right">
            <SectionTitle
              eyebrow="Our Journey So Far"
              title="What We've Accomplished Together"
              subtitle="From a handful of weekend runners to a community that shows up, every single time."
            />
            <p className="milestones-text">
              FahhKit started as a small Sunday run and grew into a full-blown fitness community — one race, one
              workout, and one &quot;say fk it&quot; moment at a time.
            </p>
            <div className="milestones-stats">
              {MILESTONES.map((m) => (
                <div className="milestone-stat" key={m.label}>
                  <span className="milestone-number">{m.number}</span>
                  <span className="milestone-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="milestones-image" data-aos="fade-left">
            <img src={foundingMembersImage} alt="FahhKit founding members" />
          </div>
        </div>
      </section>

      <section id="team" className="team-section">
        <div className="section-inner">
          <SectionTitle
            eyebrow="The People Behind FahhKit"
            title="Meet Our Team"
            subtitle="The crew who show up every week to keep the community running."
          />
          <div data-aos="fade-up">
            <TeamCarousel team={TEAM} />
          </div>
        </div>
      </section>

      <section className="cta-band">
        <span className="blob cta-blob-a" aria-hidden="true" />
        <span className="blob cta-blob-b" aria-hidden="true" />
        <div className="section-inner cta-inner" data-aos="zoom-in">
          <div>
            <h2>{isAuthed ? "Ready for your next run?" : "Ready to run with us?"}</h2>
            <p>{isAuthed ? "See what's on the calendar and get signed up." : "Registration takes less than two minutes."}</p>
          </div>
          <div className="cta-actions">
            {isAuthed ? (
              <Link to="/events" className="btn btn-primary btn-lg">
                View Events
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
