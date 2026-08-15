import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, AlertTriangle, RefreshCw, BookOpen, ChevronDown } from 'lucide-react';
import Pagination from '../components/Pagination';
import RemedyCard from '../components/RemedyCard';

const SORT_OPTIONS = [
  { label: 'Title (A–Z)', value: 'title' },
  { label: 'Title (Z–A)', value: '-title' },
  { label: 'Prep Time ↑', value: 'prepTimeMinutes' },
  { label: 'Prep Time ↓', value: '-prepTimeMinutes' },
];

export default function Remedies() {
  const [remedies, setRemedies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('title');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE}/api/categories`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCategories(data || []);
      } catch {/* non-critical */}
    };
    fetchCategories();
  }, []);

  const fetchRemedies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      const params = new URLSearchParams({ page: page.toString(), limit: '9', sort });
      if (selectedCategory) params.append('category', selectedCategory);
      const res = await fetch(`${API_BASE}/api/remedies?${params}`);
      if (!res.ok) throw new Error('Failed to fetch remedies');
      const data = await res.json();
      setRemedies(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalItems(data.meta?.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sort, page]);

  useEffect(() => { setPage(1); }, [selectedCategory, sort]);
  useEffect(() => { fetchRemedies(); }, [fetchRemedies]);

  const resultLabel = useMemo(() => {
    if (loading || error) return null;
    return `${totalItems} ${totalItems === 1 ? 'remedy' : 'remedies'}${selectedCategory ? ` in "${selectedCategory}"` : ''}`;
  }, [totalItems, loading, error, selectedCategory]);

  return (
    <div style={{ background: '#faf6f0', minHeight: '100vh' }}>

      {/* ─── BOTANICAL HERO BANNER ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #4a3218 0%, #7a5c30 40%, #c8a060 100%)',
        padding: '56px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px', padding: '5px 14px',
            fontSize: '11px', fontWeight: 700, color: '#f5dda8',
            letterSpacing: '0.08em', textTransform: 'uppercase', backdropFilter: 'blur(8px)',
          }}>
            <Sparkles size={11} />
            Natural Wellness
          </span>

          <h1 style={{
            fontFamily: "'Fraunces', 'Georgia', serif", fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#fdf6ee',
            marginTop: '14px', lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>
            Home Remedies
          </h1>
          <p style={{ marginTop: '10px', color: '#dfc090', maxWidth: '480px', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Traditional, holistic formulations — preparation times and origins — organized by what you need.
          </p>
        </div>
      </div>

      {/* ─── CONTENT SECTION ─── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>

        {/* FLOATING TOOLBAR */}
        <div style={{
          background: '#fdf8f2', border: '1px solid #e8ddd0',
          borderRadius: '12px', padding: '14px 18px',
          marginTop: '-24px', position: 'relative', zIndex: 2,
          boxShadow: '0 4px 16px rgba(80,60,30,0.08)',
        }}>
          {/* CATEGORY CHIPS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <CategoryChip label="All Remedies" active={selectedCategory === ''} onClick={() => setSelectedCategory('')} />
            {categories.map(cat => (
              <CategoryChip key={cat} label={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} />
            ))}

            {/* SORT — pushed to the right */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#9c8572' }}>Sort by</span>
              <div style={{ position: 'relative' }}>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    appearance: 'none', background: '#f5ede0',
                    border: '1px solid #d8c9b4', borderRadius: '8px',
                    padding: '6px 32px 6px 12px',
                    fontSize: '0.82rem', color: '#5a4030', fontWeight: 600,
                    cursor: 'pointer', outline: 'none',
                  }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} color="#9c7a55" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* RESULT COUNT */}
          {resultLabel && (
            <p style={{ marginTop: '10px', fontSize: '0.75rem', color: '#b0998a', borderTop: '1px solid #ede4d8', paddingTop: '10px' }}>
              {resultLabel}
            </p>
          )}
        </div>

        {/* GRID */}
        <div style={{ marginTop: '28px' }}>
          {loading ? (
            <RemediesSkeleton />
          ) : error ? (
            <RemediesError message={error} onRetry={fetchRemedies} />
          ) : remedies.length === 0 ? (
            <EmptyState selectedCategory={selectedCategory} onClear={() => setSelectedCategory('')} />
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {remedies.map(remedy => <RemedyCard key={remedy._id} remedy={remedy} />)}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── CATEGORY CHIP ── */
function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: '20px', padding: '5px 14px',
        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
        border: active ? 'none' : '1px solid #d8c9b4',
        background: active ? '#4a6e3a' : '#f5ede0',
        color: active ? '#d4efc0' : '#7a6245',
        transition: 'all 0.2s',
        boxShadow: active ? '0 2px 8px rgba(74,110,58,0.25)' : 'none',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#ede4d4'; e.currentTarget.style.borderColor = '#c8b49a'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = '#f5ede0'; e.currentTarget.style.borderColor = '#d8c9b4'; } }}
    >
      {label}
    </button>
  );
}

/* ── SKELETON ── */
function RemediesSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {[...Array(9)].map((_, i) => (
        <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', background: '#fdf8f2', border: '1px solid #e8ddd0', height: '220px' }}>
          <div style={{ height: '6px', background: '#ede4d8' }} />
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {[40, 55, 48].map((w, j) => (
                <div key={j} style={{ height: '20px', width: `${w}px`, borderRadius: '20px', background: 'linear-gradient(90deg, #ede4d8 25%, #f5ede0 50%, #ede4d8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
              ))}
            </div>
            <div style={{ height: '22px', width: '80%', borderRadius: '6px', background: '#ede4d8', marginBottom: '8px' }} />
            <div style={{ height: '14px', width: '55%', borderRadius: '6px', background: '#f0e8dc' }} />
          </div>
          <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>
        </div>
      ))}
    </div>
  );
}

/* ── EMPTY STATE ── */
function EmptyState({ selectedCategory, onClear }) {
  return (
    <div style={{
      textAlign: 'center', padding: '64px 24px',
      border: '1px dashed #c8b49a', borderRadius: '16px', background: '#fdf8f2',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#f5ede0', border: '1px solid #d8c9b4',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
      }}>
        <BookOpen size={24} color="#9c7a55" />
      </div>
      <h3 style={{ marginTop: '16px', fontFamily: "'Fraunces', serif", fontSize: '1.1rem', color: '#3b2a1a' }}>
        No remedies found
      </h3>
      <p style={{ marginTop: '6px', fontSize: '0.85rem', color: '#9c8572' }}>
        {selectedCategory
          ? `No remedies in "${selectedCategory}" yet.`
          : 'No remedies available at this time.'}
      </p>
      {selectedCategory && (
        <button onClick={onClear} style={{ marginTop: '14px', fontSize: '0.82rem', fontWeight: 700, color: '#7a6245', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          View all remedies
        </button>
      )}
    </div>
  );
}

/* ── ERROR STATE ── */
function RemediesError({ message, onRetry }) {
  return (
    <div style={{
      maxWidth: '360px', margin: '40px auto', textAlign: 'center',
      padding: '36px 28px', background: '#fdf8f2',
      border: '1px solid #e8ddd0', borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(80,60,30,0.07)',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: '#fdf0ee', border: '1px solid #f0c0b8',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
      }}>
        <AlertTriangle size={22} color="#c05040" />
      </div>
      <h3 style={{ marginTop: '14px', fontFamily: "'Fraunces', serif", fontSize: '1rem', color: '#3b2a1a' }}>
        Failed to load remedies
      </h3>
      <p style={{ marginTop: '6px', fontSize: '0.82rem', color: '#9c8572' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#7a5c30', color: '#fdf6ee',
          border: 'none', borderRadius: '40px', padding: '10px 22px',
          fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#5a4020'}
        onMouseLeave={e => e.currentTarget.style.background = '#7a5c30'}
      >
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );
}