import { Link } from 'react-router';
import { Clock, Globe, ArrowUpRight, Tag } from 'lucide-react';

const CATEGORY_COLORS = [
  { bg: '#f0f5ee', border: '#bdd3bf', text: '#4a6e4e' },
  { bg: '#fdf4e8', border: '#d8c09a', text: '#7a5c30' },
  { bg: '#f5f0ee', border: '#d0bdb4', text: '#6b4e45' },
  { bg: '#eef3f0', border: '#b4ccbc', text: '#3e6050' },
];
const colorFor = (str = '') =>
  CATEGORY_COLORS[[...str].reduce((a, c) => a + c.charCodeAt(0), 0) % CATEGORY_COLORS.length];

export default function RemedyCard({ remedy }) {
  return (
    <Link
      to={`/remedies/${remedy._id}`}
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
      {/* DECORATIVE TOP STRIPE — botanical pattern feel */}
      <div style={{
        height: '6px',
        background: 'repeating-linear-gradient(90deg, #c8b49a 0px, #c8b49a 4px, #e8ddd0 4px, #e8ddd0 12px)',
        opacity: 0.6,
      }} />

      <div style={{ padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* CATEGORY TAGS */}
        {remedy.categories && remedy.categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {remedy.categories.slice(0, 3).map((cat) => {
              const col = colorFor(cat);
              return (
                <span
                  key={cat}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: col.bg, border: `1px solid ${col.border}`,
                    borderRadius: '20px', padding: '3px 9px',
                    fontSize: '10px', fontWeight: 700, color: col.text,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}
                >
                  <Tag size={9} />
                  {cat}
                </span>
              );
            })}
          </div>
        )}

        {/* TITLE */}
        <h2 style={{
          fontFamily: "'Fraunces', 'Georgia', serif", fontWeight: 700,
          fontSize: '1.15rem', color: '#3b2a1a', lineHeight: 1.3,
          letterSpacing: '-0.01em', flexGrow: 1,
        }}>
          {remedy.title}
        </h2>

        {/* DIVIDER */}
        <div style={{ height: '1px', background: '#ede4d8', margin: '14px 0 12px' }} />

        {/* METADATA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {remedy.prepTimeMinutes != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '22px', height: '22px', borderRadius: '50%',
                background: '#f0e8dc', border: '1px solid #d8c9b4', flexShrink: 0,
              }}>
                <Clock size={11} color="#9c7a55" />
              </span>
              <span style={{ fontSize: '0.78rem', color: '#7a6245' }}>
                <strong style={{ color: '#5a4030', fontWeight: 600 }}>Prep: </strong>
                {remedy.prepTimeMinutes} mins
              </span>
            </div>
          )}
          {remedy.origin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '22px', height: '22px', borderRadius: '50%',
                background: '#f0e8dc', border: '1px solid #d8c9b4', flexShrink: 0,
              }}>
                <Globe size={11} color="#9c7a55" />
              </span>
              <span style={{ fontSize: '0.78rem', color: '#7a6245' }}>
                <strong style={{ color: '#5a4030', fontWeight: 600 }}>Origin: </strong>
                {remedy.origin}
              </span>
            </div>
          )}
        </div>

        {/* FOOTER LINK */}
        <div style={{
          marginTop: '16px', paddingTop: '12px',
          borderTop: '1px solid #ede4d8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7a6245', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            View Remedy
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#f0e8dc', border: '1px solid #d8c9b4',
            transition: 'background 0.2s',
          }} className="group-hover:bg-[#d8c9b4]">
            <ArrowUpRight size={14} color="#7a6245" />
          </span>
        </div>
      </div>
    </Link>
  );
}
