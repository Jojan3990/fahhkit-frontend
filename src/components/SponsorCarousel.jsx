import SectionTitle from "./SectionTitle";
import "./SponsorCarousel.css";

// Placeholder sponsors — swap these for real partner names/logos.
const SPONSORS = [
  "TrailBlazer Gear",
  "PaceMaker Nutrition",
  "SwiftSole Running Co.",
  "Summit Sports",
  "PureHydrate",
  "Cafe Bizarre",
];

export default function SponsorCarousel() {
  const track = [...SPONSORS, ...SPONSORS];

  return (
    <section className="sponsors">
      <div className="section-inner">
        <SectionTitle eyebrow="Our Sponsors" title="Trusted by Leading Companies" />
      </div>
      <div className="sponsors-track-wrap">
        <div className="sponsors-track">
          {track.map((name, i) => (
            <div className="sponsor-card" key={`${name}-${i}`}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
