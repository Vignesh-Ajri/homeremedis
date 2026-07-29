import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Globe,
  Tag,
  CheckCircle2,
  BookOpen,
  Sprout,
  AlertTriangle,
  RefreshCw,
  NotebookText,
} from 'lucide-react';
import PlantCard from '../components/PlantCard';

export default function RemedyDetail() {
  const { id } = useParams();
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRemedy = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE}/api/remedies/${id}`);
      if (!res.ok) throw new Error('Remedy not found');
      const data = await res.json();
      setRemedy(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRemedy();
  }, [fetchRemedy]);

  if (loading) return <RemedyDetailSkeleton />;
  if (error) return <RemedyDetailError message={error} onRetry={fetchRemedy} />;
  if (!remedy) return <RemedyDetailError message="No data found for this remedy." onRetry={fetchRemedy} />;

  // method is genuinely sequential (a preparation process), so split it into
  // numbered steps rather than plain paragraphs
  const methodSteps = remedy.method
    ? remedy.method.split('\n\n').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800" style={{ fontFamily: "'Inter', sans-serif" }}>


      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-200 opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute top-72 right-0 h-80 w-80 rounded-full bg-amber-200 opacity-20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
          {/* BACK BUTTON */}
          <Link
            to="/remedies"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-emerald-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Remedies
          </Link>

          {/* MAIN REMEDY CARD */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-sm md:p-10">
            {/* CATEGORIES */}
            {remedy.categories && remedy.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {remedy.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                  >
                    <Tag className="h-3 w-3" />
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* TITLE */}
            <h1
              className="mt-4 text-3xl text-stone-900 md:text-4xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              {remedy.title}
            </h1>

            {/* METADATA STRIP */}
            <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-stone-100 py-4 text-sm text-stone-600">
              {remedy.prepTimeMinutes != null && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-stone-400" />
                  <span>
                    <strong className="font-semibold text-stone-800">Prep Time:</strong>{' '}
                    {remedy.prepTimeMinutes} minutes
                  </span>
                </div>
              )}
              {remedy.origin && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-stone-400" />
                  <span>
                    <strong className="font-semibold text-stone-800">Origin:</strong>{' '}
                    {remedy.origin}
                  </span>
                </div>
              )}
            </div>

            {/* INGREDIENTS & METHOD GRID */}
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* INGREDIENTS COLUMN */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <h2
                    className="text-xl text-stone-900"
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                  >
                    Ingredients
                  </h2>
                  {remedy.ingredients && remedy.ingredients.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {remedy.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-stone-500">No ingredients specified.</p>
                  )}
                </div>
              </div>

              {/* METHOD COLUMN */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2">
                  <NotebookText className="h-4 w-4 text-amber-700" />
                  <h2
                    className="text-xl text-stone-900"
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                  >
                    Preparation Method
                  </h2>
                </div>

                {methodSteps.length > 0 ? (
                  <ol className="mt-4 space-y-5">
                    {methodSteps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                          {index + 1}
                        </span>
                        <p className="whitespace-pre-line pt-0.5 text-sm leading-relaxed text-stone-600">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-sm italic text-stone-500">No method provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* ASSOCIATED PLANTS SECTION */}
          <div className="mt-14">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Sprout className="h-4 w-4" />
              Key Ingredients
            </div>
            <h2
              className="mt-1 text-2xl text-stone-900"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Plants Used in this Remedy
            </h2>

            {remedy.plantIds && remedy.plantIds.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {remedy.plantIds.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500">
                <BookOpen className="mx-auto h-8 w-8 text-stone-300" />
                <p className="mt-2 text-sm">No associated botanical profiles linked to this remedy.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RemedyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl animate-pulse px-6 py-10">
        <div className="h-4 w-32 rounded bg-stone-200" />

        <div className="mt-6 space-y-6 rounded-3xl border border-stone-200 bg-white p-8 md:p-10">
          <div className="h-5 w-24 rounded-full bg-stone-200" />
          <div className="h-9 w-2/3 rounded bg-stone-200" />
          <div className="h-10 w-full rounded bg-stone-100" />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-60 rounded-2xl bg-stone-100 lg:col-span-5" />
            <div className="space-y-3 lg:col-span-7">
              <div className="h-6 w-1/3 rounded bg-stone-200" />
              <div className="h-4 w-full rounded bg-stone-200" />
              <div className="h-4 w-5/6 rounded bg-stone-200" />
              <div className="h-4 w-4/6 rounded bg-stone-200" />
            </div>
          </div>
        </div>

        <div className="mt-14 space-y-4">
          <div className="h-7 w-64 rounded bg-stone-200" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl border border-stone-200 bg-stone-100"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RemedyDetailError({ message, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="max-w-sm rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-stone-900">
          Couldn't load this remedy
        </h2>
        <p className="mt-2 text-sm text-stone-500">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-900"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            to="/remedies"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
          >
            Back to Remedies
          </Link>
        </div>
      </div>
    </div>
  );
}