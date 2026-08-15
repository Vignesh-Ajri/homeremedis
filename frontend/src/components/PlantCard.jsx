import { Link } from 'react-router';
import { MapPin, ArrowUpRight, Leaf, Trees, Pill } from 'lucide-react';

const ACCENT_PALETTES = [
  { badge: '#c8b49a', badgeBg: '#fdf6ee', leafColor: '#7a6245' },
  { badge: '#98b49a', badgeBg: '#f0f5f0', leafColor: '#4a6e4e' },
  { badge: '#b4a898', badgeBg: '#f5f2ee', leafColor: '#6b5c48' },
  { badge: '#a0b4a4', badgeBg: '#eef3ef', leafColor: '#4e6e52' },
  { badge: '#c4ac8c', badgeBg: '#fdf4e8', leafColor: '#7a5c30' },
];

const paletteFor = (str = '') =>
  ACCENT_PALETTES[[...str].reduce((a, c) => a + c.charCodeAt(0), 0) % ACCENT_PALETTES.length];

export default function PlantCard({ plant }) {
  const pal = paletteFor(plant.name);
  const parts = plant.partsUsed?.slice(0, 3) || [];
  const compounds = plant.activeCompounds?.slice(0, 2) || [];

  return (
    <Link
      to={`/plants/${plant._id}`}
      className="group flex flex-col overflow-hidden"
      style={{
        borderRadius: '16px',
        background: '#fdf8f2',
        border: '1px solid #e8ddd0',
        boxShadow: '0 2px 8px rgba(100,80,50,0.07)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(100,80,50,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(100,80,50,0.07)';
      }}
    >
      {/* ── IMAGE — compact fixed height ── */}
      <div style={{
        position: 'relative', height: '160px', overflow: 'hidden',
        background: pal.badgeBg, flexShrink: 0,
      }}>
        <img
          src={plant.imageUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600'}
          alt={plant.name}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="group-hover:scale-105"
        />
        {/* Subtle bottom fade into card body */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(50,32,12,0.35) 0%, transparent 55%)',
        }} />
        {/* Origin badge */}
        {plant.countryOfOrigin && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            background: 'rgba(253,246,238,0.93)', border: `1px solid ${pal.badge}`,
            borderRadius: '20px', padding: '3px 9px',
            fontSize: '10.5px', fontWeight: 600, color: pal.leafColor,
            backdropFilter: 'blur(6px)', letterSpacing: '0.02em',
          }}>
            <MapPin size={9} />
            {plant.countryOfOrigin}
          </span>
        )}
        {/* Leaf icon badge — bottom right */}
        <span style={{
          position: 'absolute', bottom: '8px', right: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'rgba(253,246,238,0.9)', border: `1px solid ${pal.badge}`,
          backdropFilter: 'blur(4px)',
        }}>
          <Leaf size={12} color={pal.leafColor} strokeWidth={1.75} />
        </span>
      </div>

      {/* ── CARD BODY ── */}
      <div style={{ padding: '16px 18px 14px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

        {/* Plant name + scientific name */}
        <h2 style={{
          fontFamily: "'Fraunces', 'Georgia', serif", fontWeight: 700,
          fontSize: '1.1rem', color: '#3b2a1a', lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>
          {plant.name}
        </h2>
        {plant.scientificName && (
          <p style={{ marginTop: '3px', fontSize: '0.75rem', color: '#9c8572', fontStyle: 'italic' }}>
            {plant.scientificName}
          </p>
        )}

        {/* ── INFO ROWS ── */}
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>

          {/* Habitat */}
          {plant.habitat && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#f0e8dc', border: `1px solid ${pal.badge}`, flexShrink: 0, marginTop: '1px',
              }}>
                <Trees size={10} color={pal.leafColor} />
              </span>
              <span style={{ fontSize: '0.75rem', color: '#7a6245', lineHeight: 1.4 }}>
                <strong style={{ color: '#5a4030', fontWeight: 600 }}>Habitat: </strong>
                {plant.habitat}
              </span>
            </div>
          )}

          {/* Parts Used */}
          {parts.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#f0e8dc', border: `1px solid ${pal.badge}`, flexShrink: 0, marginTop: '1px',
              }}>
                <Pill size={10} color={pal.leafColor} />
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '1px' }}>
                {parts.map(p => (
                  <span key={p} style={{
                    background: pal.badgeBg, border: `1px solid ${pal.badge}`,
                    borderRadius: '12px', padding: '2px 8px',
                    fontSize: '10px', fontWeight: 600, color: pal.leafColor,
                    letterSpacing: '0.03em',
                  }}>
                    {p}
                  </span>
                ))}
                {(plant.partsUsed?.length || 0) > 3 && (
                  <span style={{ fontSize: '10px', color: '#b0998a', alignSelf: 'center' }}>
                    +{plant.partsUsed.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Active Compounds */}
          {compounds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#eef3ef', border: '1px solid #bdd3bf', flexShrink: 0, marginTop: '1px',
              }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#4a6e4e' }}>⚗</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#7a6245', lineHeight: 1.4 }}>
                <strong style={{ color: '#5a4030', fontWeight: 600 }}>Compounds: </strong>
                {compounds.join(', ')}
                {(plant.activeCompounds?.length || 0) > 2 && (
                  <span style={{ color: '#b0998a' }}> +{plant.activeCompounds.length - 2} more</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          marginTop: '14px', paddingTop: '12px',
          borderTop: '1px solid #ede4d8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto', paddingTop: '12px',
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7a6245', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            View Details
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '26px', height: '26px', borderRadius: '50%',
            background: '#f0e8dc', border: '1px solid #d8c9b4',
            transition: 'background 0.2s',
          }} className="group-hover:bg-[#d8c9b4]">
            <ArrowUpRight size={13} color="#7a6245" />
          </span>
        </div>
      </div>
    </Link>
  );
}
