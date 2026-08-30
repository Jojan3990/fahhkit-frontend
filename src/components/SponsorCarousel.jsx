import SectionTitle from './SectionTitle'
import './SponsorCarousel.css'
import sponsor1 from '../assets/images/sponsors/Image.png'
import sponsor3 from '../assets/images/sponsors/Image (2).png'
import sponsor4 from '../assets/images/sponsors/Image (3).png'
import sponsor5 from '../assets/images/sponsors/Image (4).png'
import sponsor6 from '../assets/images/sponsors/Image (5).png'
import sponsor7 from '../assets/images/sponsors/Image (6).png'
import sponsor8 from '../assets/images/sponsors/Image (7).png'

// Most of these logos have had their original flat background cut to
// transparency (see remove_bg script history), so the card needs to supply
// that same background back — a shared theme color would leave a light logo
// unreadable on a light-mode card (or a dark one on a dark-mode card).
// Urban Car Rental is untouched (a full photographic poster, not a logo on a
// flat background), so it keeps `cover` and no forced card color.
const SPONSORS = [
  { src: sponsor1, bg: '#ffffff' },
  { src: sponsor3, bg: '#141414' },
  { src: sponsor4, bg: '#d3c1b3' },
  { src: sponsor5, fit: 'cover' },
  { src: sponsor6, bg: '#ffffff' },
  { src: sponsor7, bg: '#0a0a0a' },
  { src: sponsor8, bg: '#ffffff' },
]

export default function SponsorCarousel() {
  const track = [...SPONSORS, ...SPONSORS]

  return (
    <section className="sponsors">
      <div className="section-inner">
        <SectionTitle
          eyebrow="Our Partners"
          title="Trusted by Leading Brands"
        />
      </div>
      <div className="sponsors-track-wrap">
        <div className="sponsors-track">
          {track.map((sponsor, i) => (
            <div
              className="sponsor-card"
              key={i}
              style={sponsor.bg ? { background: sponsor.bg } : undefined}
            >
              <img
                src={sponsor.src}
                alt="Partner logo"
                style={sponsor.fit ? { objectFit: sponsor.fit } : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
