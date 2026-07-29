import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import Pagination from '../components/Pagination';
import SortFilter from '../components/SortFilter';
import RemedyCard from '../components/RemedyCard';

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

  const sortOptions = [
    { label: 'Title (A-Z)', value: 'title' },
    { label: 'Title (Z-A)', value: '-title' },
    { label: 'Prep Time (Low to High)', value: 'prepTimeMinutes' },
    { label: 'Prep Time (High to Low)', value: '-prepTimeMinutes' },
  ];

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${API_BASE}/api/categories`);
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Remedies (filtered by selected category)
  const fetchRemedies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6', // 6 items per page looks good in grid
        sort: sort
      });
      
      if (selectedCategory) params.append('category', selectedCategory);

      const url = `${API_BASE}/api/remedies?${params.toString()}`;
      const res = await fetch(url);
      
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

  useEffect(() => {
    // Reset to page 1 when category or sort changes
    setPage(1);
  }, [selectedCategory, sort]);

  useEffect(() => {
    fetchRemedies();
  }, [fetchRemedies]);

  const resultLabel = useMemo(() => {
    if (loading || error) return null;
    return `${totalItems} ${totalItems === 1 ? 'remedy' : 'remedies'}${selectedCategory ? ` found in "${selectedCategory}"` : ''}`;
  }, [totalItems, loading, error, selectedCategory]);

  return (
    <div className="relative overflow-hidden py-10 px-6">
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber-200 opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute top-52 -left-24 h-80 w-80 rounded-full bg-emerald-200 opacity-25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-6 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
              Natural Wellness
            </div>
            <h1
              className="mt-3 text-4xl text-stone-900 md:text-5xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Home Remedies
            </h1>
            <p className="mt-2 max-w-lg text-stone-500">
              Traditional, holistic formulations — with preparation times and
              origins — organized by what you're looking to feel better from.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <SortFilter sortOptions={sortOptions} sort={sort} onSortChange={setSort} />
          </div>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              selectedCategory === ''
                ? 'bg-emerald-800 text-stone-50 shadow-sm'
                : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            All Remedies
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-stone-50 shadow-sm'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {resultLabel && (
          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-stone-400">
            {resultLabel}
          </p>
        )}

        {/* CONTENT STATES */}
        {loading ? (
          <RemediesSkeleton />
        ) : error ? (
          <RemediesError message={error} onRetry={fetchRemedies} />
        ) : remedies.length === 0 ? (
          <EmptyState selectedCategory={selectedCategory} onClear={() => setSelectedCategory('')} />
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {remedies.map((remedy) => (
                <RemedyCard key={remedy._id} remedy={remedy} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}


function EmptyState({ selectedCategory, onClear }) {
  return (
    <div className="mt-10 rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
        <BookOpen className="h-7 w-7 text-amber-700" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900">No remedies found</h3>
      <p className="mt-1 text-sm text-stone-500">
        {selectedCategory
          ? `There are currently no remedies in the "${selectedCategory}" category.`
          : 'No remedies available at this time.'}
      </p>
      {selectedCategory && (
        <button
          onClick={onClear}
          className="mt-4 text-sm font-semibold text-emerald-800 hover:underline"
        >
          View all remedies
        </button>
      )}
    </div>
  );
}

function RemediesSkeleton() {
  return (
    <div className="mt-8 grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex h-56 flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6"
        >
          <div className="space-y-3">
            <div className="h-4 w-1/3 rounded bg-stone-200" />
            <div className="h-6 w-3/4 rounded bg-stone-200" />
            <div className="h-4 w-1/2 rounded bg-stone-200" />
          </div>
          <div className="space-y-2 border-t border-stone-100 pt-4">
            <div className="h-4 w-2/3 rounded bg-stone-200" />
            <div className="h-4 w-1/3 rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RemediesError({ message, onRetry }) {
  return (
    <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900">Failed to load remedies</h3>
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