import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  AlertTriangle,
  RefreshCw,
  Sprout,
  X,
} from 'lucide-react';
import Pagination from '../components/Pagination';
import SortFilter from '../components/SortFilter';
import PlantCard from '../components/PlantCard';

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Name (Z-A)', value: '-name' },
    { label: 'Origin', value: 'countryOfOrigin' },
  ];

  const fetchPlants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6', // 6 items per page looks good in grid
        sort: sort
      });
      
      if (search) params.append('search', search);

      const url = `${API_BASE}/api/plants?${params.toString()}`;
      const res = await fetch(url);
      
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

  useEffect(() => {
    // Reset to page 1 when search or sort changes
    setPage(1);
  }, [search, sort]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPlants();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchPlants]);

  const resultLabel = useMemo(() => {
    if (loading || error) return null;
    return `${totalItems} ${totalItems === 1 ? 'plant' : 'plants'}${search ? ` found for "${search}"` : ''}`;
  }, [totalItems, loading, error, search]);

  return (
    <div className="relative overflow-hidden py-10 px-6">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-200 opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-0 h-80 w-80 rounded-full bg-amber-200 opacity-25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col gap-6 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Sprout className="h-3.5 w-3.5" />
              Botanical Index
            </div>
            <h1
              className="mt-3 text-4xl text-stone-900 md:text-5xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Medicinal Plants
            </h1>
            <p className="mt-2 max-w-md text-stone-500">
              Explore nature's pharmacy — active compounds, origins, and
              traditional uses, one plant at a time.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            {/* SEARCH BAR */}
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name, origin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-stone-300 bg-white py-2.5 pl-10 pr-9 text-sm text-stone-800 placeholder-stone-400 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* SORTING */}
            <SortFilter sortOptions={sortOptions} sort={sort} onSortChange={setSort} />
          </div>
        </div>

        {resultLabel && (
          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-stone-400">
            {resultLabel}
          </p>
        )}

        {/* CONTENT STATES */}
        {loading ? (
          <PlantsSkeleton />
        ) : error ? (
          <PlantsError message={error} onRetry={fetchPlants} />
        ) : plants.length === 0 ? (
          <EmptyState search={search} onClear={() => setSearch('')} />
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plants.map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}


function EmptyState({ search, onClear }) {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
        <Sprout className="h-7 w-7 text-emerald-700" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900">No plants found</h3>
      <p className="mt-1 text-sm text-stone-500">
        {search
          ? `No results match "${search}". Try searching for something else.`
          : 'The plant catalog is currently empty.'}
      </p>
      {search && (
        <button
          onClick={onClear}
          className="mt-4 text-sm font-semibold text-emerald-800 hover:underline"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

function PlantsSkeleton() {
  return (
    <div className="mt-6 grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <div className="aspect-[4/3] bg-stone-200" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-3/4 rounded bg-stone-200" />
            <div className="h-4 w-1/2 rounded bg-stone-200" />
            <div className="mt-4 h-4 w-1/3 rounded border-t border-stone-100 bg-stone-200 pt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PlantsError({ message, onRetry }) {
  return (
    <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900">Failed to load plants</h3>
      <p className="mt-1 text-sm text-stone-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-900"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}