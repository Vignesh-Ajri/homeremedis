import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, AlertTriangle, RefreshCw, Sprout, X, ChevronDown } from 'lucide-react';
import Pagination from '../components/Pagination';
import PlantCard from '../components/PlantCard';

const SORT_OPTIONS = [
  { label: 'Name (A–Z)', value: 'name' },
  { label: 'Name (Z–A)', value: '-name' },
  { label: 'Origin', value: 'countryOfOrigin' },
];

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      const params = new URLSearchParams({ page: page.toString(), limit: '8', sort });
      if (search) params.append('search', search);
      const res = await fetch(`${API_BASE}/api/plants?${params}`);
      if (!res.ok) throw new Error('Failed to fetch plants');
      const data = await res.json();
      setPlants(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalItems(data.meta?.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, sort, page]);

  useEffect(() => { setPage(1); }, [search, sort]);

  useEffect(() => {
    const t = setTimeout(fetchPlants, 300);
    return () => clearTimeout(t);
  }, [fetchPlants]);

  const resultLabel = useMemo(() => {
    if (loading || error) return null;
    return `${totalItems} ${totalItems === 1 ? 'plant' : 'plants'}${search ? ` for "${search}"` : ''}`;
  }, [totalItems, loading, error, search]);

  return (
    <div style={{ background: '#faf6f0', minHeight: '100vh' }}>

      {/* ─── BOTANICAL HERO BANNER ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #2d4a2d 0%, #4a6e3a 40%, #7a9e6a 100%)',
        padding: '56px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '200px', height: '200px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px',
          width: '280px', height: '280px', borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '20px', padding: '5px 14px',
            fontSize: '11px', fontWeight: 700, color: '#d4efc0',
            letterSpacing: '0.08em', textTransform: 'uppercase', backdropFilter: 'blur(8px)',
          }}>
            <Sprout size={12} />
            Botanical Index
          </span>

          <h1 style={{
            fontFamily: "'Fraunces', 'Georgia', serif", fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#f5f0e8',
            marginTop: '14px', lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>
            Medicinal Plants
          </h1>
          <p style={{ marginTop: '10px', color: '#b8d4a0', maxWidth: '460px', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Explore nature's pharmacy — active compounds, origins, and traditional uses, one plant at a time.
          </p>

          {/* SEARCH BAR */}
          <div style={{ marginTop: '28px', position: 'relative', maxWidth: '440px' }}>
            <Search size={16} color="#9cb888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search by name or origin…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '40px', padding: '13px 44px 13px 44px',
                fontSize: '0.9rem', color: '#f5f0e8', outline: 'none',
              }}
              onFocus={e => e.target.style.background = 'rgba(255,255,255,0.18)'}
              onBlur={e => e.target.style.background = 'rgba(255,255,255,0.12)'}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#b8d4a0' }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── CONTENT SECTION ─── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>

        {/* TOOLBAR */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          background: '#fdf8f2', border: '1px solid #e8ddd0',
          borderRadius: '12px', padding: '12px 18px',
          marginTop: '-24px', position: 'relative', zIndex: 2,
          boxShadow: '0 4px 16px rgba(80,60,30,0.08)',
        }}>
          <span style={{ fontSize: '0.78rem', color: '#9c8572', fontWeight: 500 }}>
            {resultLabel || <span style={{ opacity: 0.4 }}>Loading…</span>}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#9c8572' }}>Sort by</span>
            <div style={{ position: 'relative' }}>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  appearance: 'none', background: '#f5ede0',
                  border: '1px solid #d8c9b4', borderRadius: '8px',
                  padding: '6px 32px 6px 12px', fontSize: '0.82rem',
                  color: '#5a4030', fontWeight: 600, cursor: 'pointer', outline: 'none',
                }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={13} color="#9c7a55" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* GRID */}
        <div style={{ marginTop: '28px' }}>
          {loading ? (
            <PlantsSkeleton />
          ) : error ? (
            <PlantsError message={error} onRetry={fetchPlants} />
          ) : plants.length === 0 ? (
            <EmptyState search={search} onClear={() => setSearch('')} />
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px',
              }}>
                {plants.map(plant => <PlantCard key={plant._id} plant={plant} />)}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── SKELETON ── */
function PlantsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', background: '#fdf8f2', border: '1px solid #e8ddd0' }}>
          <div style={{ aspectRatio: '3/4', maxHeight: '260px', background: 'linear-gradient(90deg, #ede4d8 25%, #f5ede0 50%, #ede4d8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
          <div style={{ padding: '18px 20px 16px' }}>
            <div style={{ height: '20px', width: '70%', borderRadius: '6px', background: '#ede4d8', marginBottom: '8px' }} />
            <div style={{ height: '14px', width: '50%', borderRadius: '6px', background: '#f0e8dc' }} />
          </div>
          <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>
        </div>
      ))}
    </div>
  );
}

/* ── EMPTY STATE ── */
function EmptyState({ search, onClear }) {
  return (
    <div style={{
      textAlign: 'center', padding: '64px 24px',
      border: '1px dashed #c8b49a', borderRadius: '16px', background: '#fdf8f2',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#f0e8dc', border: '1px solid #d8c9b4',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
      }}>
        <Sprout size={24} color="#7a6245" />
      </div>
      <h3 style={{ marginTop: '16px', fontFamily: "'Fraunces', serif", fontSize: '1.1rem', color: '#3b2a1a' }}>
        No plants found
      </h3>
      <p style={{ marginTop: '6px', fontSize: '0.85rem', color: '#9c8572' }}>
        {search ? `No results for "${search}". Try a different term.` : 'The plant catalog is currently empty.'}
      </p>
      {search && (
        <button onClick={onClear} style={{ marginTop: '16px', fontSize: '0.82rem', fontWeight: 700, color: '#7a6245', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Clear search
        </button>
      )}
    </div>
  );
}

/* ── ERROR STATE ── */
function PlantsError({ message, onRetry }) {
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
        Failed to load plants
      </h3>
      <p style={{ marginTop: '6px', fontSize: '0.82rem', color: '#9c8572' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#4a6e3a', color: '#f0f8e8',
          border: 'none', borderRadius: '40px', padding: '10px 22px',
          fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = '#3a5a2c'}
        onMouseLeave={e => e.target.style.background = '#4a6e3a'}
      >
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );
}