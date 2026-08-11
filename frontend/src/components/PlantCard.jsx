import { Link } from 'react-router';
import { MapPin, ArrowRight, Leaf } from 'lucide-react';

const PALETTE = [
  { tint: 'bg-emerald-50', ring: 'ring-emerald-200', text: 'text-emerald-700' },
  { tint: 'bg-amber-50', ring: 'ring-amber-200', text: 'text-amber-700' },
  { tint: 'bg-teal-50', ring: 'ring-teal-200', text: 'text-teal-700' },
  { tint: 'bg-lime-50', ring: 'ring-lime-200', text: 'text-lime-700' },
  { tint: 'bg-violet-50', ring: 'ring-violet-200', text: 'text-violet-700' },
];

export const paletteFor = (str = '') =>
  PALETTE[[...str].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

export default function PlantCard({ plant }) {
  const p = paletteFor(plant.name);
  return (
    <Link
      to={`/plants/${plant._id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5"
    >
      <div className={`relative aspect-[4/3] w-full overflow-hidden ${p.tint}`}>
        <img
          src={
            plant.imageUrl ||
            'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600'
          }
          alt={plant.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {plant.countryOfOrigin && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-stone-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-stone-700 shadow-sm backdrop-blur-md">
            <MapPin className="h-3 w-3 text-stone-400" />
            {plant.countryOfOrigin}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${p.tint} ring-1 ${p.ring}`}>
              <Leaf className={`h-3.5 w-3.5 ${p.text}`} strokeWidth={1.75} />
            </span>
            <h2
              className="text-xl text-stone-900 transition group-hover:text-emerald-800"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              {plant.name}
            </h2>
          </div>
          <p className="mt-1.5 text-sm italic text-stone-500">
            {plant.scientificName}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-semibold text-emerald-800">
          <span>View plant details</span>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
