import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sprout,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Leaf,
  FlaskConical,
  BookOpen,
} from 'lucide-react';
import RemedyCard from '../components/RemedyCard';

export default function PlantDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API_BASE}/api/plants/${id}`);
      if (!res.ok) throw new Error('Plant not found');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlant();
  }, [fetchPlant]);

  if (loading) return <PlantDetailSkeleton />;
  if (error) return <PlantDetailError message={error} onRetry={fetchPlant} />;
  if (!data) return <PlantDetailError message="No data found for this plant." onRetry={fetchPlant} />;

  const { plant, remedies } = data;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800" style={{ fontFamily: "'Inter', sans-serif" }}>


      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-emerald-200 opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute top-64 -left-24 h-80 w-80 rounded-full bg-amber-200 opacity-20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
          <Link
            to="/plants"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-emerald-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plants
          </Link>

          {/* HEADER CARD */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-stone-100 md:aspect-auto md:h-full">
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <Leaf className="h-3.5 w-3.5" />
                  Plant profile
                </div>

                <h1
                  className="mt-4 text-4xl text-stone-900"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                >
                  {plant.name}
                </h1>
                <p className="mt-1 text-base italic text-stone-500">
                  {plant.scientificName}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-5">
                  <InfoBlock icon={MapPin} label="Origin" value={plant.countryOfOrigin} />
                  <InfoBlock icon={Sprout} label="Habitat" value={plant.habitat} />
                </div>

                <div className="mt-7 space-y-5">
                  <TagBlock
                    label="Parts Used"
                    items={plant.partsUsed}
                    tint="border-emerald-200 bg-emerald-50 text-emerald-800"
                  />
                  <TagBlock
                    label="Active Compounds"
                    icon={FlaskConical}
                    items={plant.activeCompounds}
                    tint="border-amber-200 bg-amber-50 text-amber-800"
                  />
                </div>
              </div>
            </div>

            {plant.precautions && (
              <div className="flex items-start gap-4 border-t border-amber-200 bg-amber-50 p-6">
                <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <h3 className="font-semibold text-stone-900">Precautions</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">
                    {plant.precautions}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* REMEDIES */}
          <div className="mt-14">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <BookOpen className="h-4 w-4" />
              Put it to use
            </div>
            <h2
              className="mt-1 text-2xl text-stone-900 md:text-3xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Remedies using {plant.name}
            </h2>

            {remedies && remedies.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {remedies.map((remedy) => (
                  <RemedyCard key={remedy._id} remedy={remedy} />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500">
                No remedies listed for this plant yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 text-sm text-stone-700">{value || '—'}</p>
    </div>
  );
}

function TagBlock({ label, items, tint, icon: Icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${tint}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl animate-pulse px-6 py-10">
        <div className="h-4 w-32 rounded bg-stone-200" />

        <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-square bg-stone-200 md:aspect-auto md:h-96" />
            <div className="space-y-5 p-8">
              <div className="h-5 w-28 rounded-full bg-stone-200" />
              <div className="h-8 w-2/3 rounded bg-stone-200" />
              <div className="h-4 w-1/3 rounded bg-stone-200" />
              <div className="mt-4 grid grid-cols-2 gap-5">
                <div className="h-10 rounded bg-stone-200" />
                <div className="h-10 rounded bg-stone-200" />
              </div>
              <div className="h-14 rounded bg-stone-200" />
              <div className="h-14 rounded bg-stone-200" />
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="h-7 w-64 rounded bg-stone-200" />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-stone-200 bg-stone-100"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlantDetailError({ message, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="max-w-sm rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-stone-900">
          Couldn't load this plant
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
            to="/plants"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
          >
            Back to Plants
          </Link>
        </div>
      </div>
    </div>
  );
}