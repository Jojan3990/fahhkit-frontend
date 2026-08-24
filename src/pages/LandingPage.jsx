import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import SectionTitle from "../components/SectionTitle";
import NextEventBanner from "../components/NextEventBanner";
import SponsorCarousel from "../components/SponsorCarousel";
import Footer from "../components/Footer";
import { getJson, resolveFileUrl } from "../api/client";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { EVENT_TYPE_LABELS, formatDate } from "../utils/events";
import bannerImage from "../assets/images/Fahhkit-Banner.jfif";
import sundayRundayImage from "../assets/images/Sunday-Runday.jfif";
import "./LandingPage.css";
import "./EventsPage.css";

const SLIDES = [
  {
    image: bannerImage,
    title: "Fahhkit Fitness Club",
    subtitle: "Say fk it and get it done!",
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
  { number: "500+", label: "Members Joined" },
  { number: "120+", label: "Events Hosted" },
  { number: "15K+", label: "KM Logged Together" },
  { number: "3", label: "Years Running Strong" },
];

export default function LandingPage() {
  const { isAuthed } = useCurrentUser();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!isAuthed) {
      setEvents([]);
      return;
    }
    getJson("/v1/event/upcoming")
      .then((data) => setEvents((data || []).slice(0, 3)))
      .catch(() => {});
  }, [isAuthed]);

  return (
    <div className="landing">
      <Navbar />

      <NextEventBanner event={events[0]} />

      <Carousel slides={SLIDES} />

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
            <img src={sundayRundayImage} alt="FahhKit community running together" />
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
