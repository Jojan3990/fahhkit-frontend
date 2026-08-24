import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import SectionTitle from "../components/SectionTitle";
import { eventToSlide } from "../components/NextEventBanner";
import SponsorCarousel from "../components/SponsorCarousel";
import Footer from "../components/Footer";
import { getJson, resolveFileUrl } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { EVENT_TYPE_LABELS, formatDate } from "../utils/events";
import bannerImage from "../assets/images/Fahhkit-Banner.jfif";
import sundayRundayImage from "../assets/images/Sunday-Runday.jfif";
import foundingMembersImage from "../assets/images/founding-members.jfif";
import "./LandingPage.css";
import "./EventsPage.css";

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

// TODO: swap in each member's real photo, name, role, and bio when available
const TEAM = [
  {
    name: "Team Member Name",
    role: "Founder & Head Coach",
    photo: foundingMembersImage,
    bio: "Started FahhKit with a single Sunday run and hasn't missed one since. Believes every workout should feel like showing up for your friends.",
  },
  {
    name: "Team Member Name",
    role: "Run Coach",
    photo: foundingMembersImage,
    bio: "Plans the routes, sets the pace, and makes sure nobody gets left behind — literally or figuratively.",
  },
  {
    name: "Team Member Name",
    role: "Community Lead",
    photo: foundingMembersImage,
    bio: "The friendly face who welcomes every new member and keeps the group chat alive between events.",
  },
  {
    name: "Team Member Name",
    role: "Events Coordinator",
    photo: foundingMembersImage,
    bio: "Turns \"say fk it\" into an actual race day — venues, logistics, and snacks all sorted.",
  },
];

export default function LandingPage() {
  const { isAuthed } = useCurrentUser();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getJson("/v1/event/upcoming")
      .then((data) => setEvents((data || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  const slides = [...events.map((event, i) => eventToSlide(event, i === 0)), ...SLIDES];

  return (
    <div className="landing">
      <Navbar />

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

      {events.length > 0 && (
        <section id="events" className="landing-events">
          <div className="section-inner">
            <SectionTitle
              eyebrow="Don't Miss Out"
              title="Upcoming Events"
              subtitle="Published races and community events on the calendar."
            />
            <div className="events-grid">
              {events.map((event, i) => (
                <div className="event-card" key={event.id} data-aos="fade-up" data-aos-delay={i * 100}>
                  {event.eventImageUrl1 && (
                    <div className="event-card-image-wrap">
                      <img src={resolveFileUrl(event.eventImageUrl1)} alt={event.name} className="event-card-image" />
                    </div>
                  )}
                  <div className="event-card-body">
                    <span className="event-card-type">{EVENT_TYPE_LABELS[event.type] || event.type}</span>
                    <h3>{event.name}</h3>
                    <dl className="event-card-meta">
                      <div>
                        <dt>Date</dt>
                        <dd>{formatDate(event.date)}</dd>
                      </div>
                      {event.venue && (
                        <div>
                          <dt>Venue</dt>
                          <dd>{event.venue}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              ))}
            </div>
            <div className="landing-events-more">
              <Link to="/events" className="btn btn-outline">
                View All Events
              </Link>
            </div>
          </div>
        </section>
      )}

      <section id="team" className="team-section">
        <div className="section-inner">
          <SectionTitle
            eyebrow="The People Behind FahhKit"
            title="Meet Our Team"
            subtitle="The crew who show up every week to keep the community running."
          />
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div className="team-card" key={member.name} data-aos="fade-up" data-aos-delay={(i % 4) * 100}>
                <div className="team-card-photo">
                  <img src={member.photo} alt={member.name} />
                </div>
                <div className="team-card-body">
                  <h3>{member.name}</h3>
                  <span className="team-card-role">{member.role}</span>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
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
