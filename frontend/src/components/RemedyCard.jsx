import { Link } from 'react-router';
import { Clock, Globe, ArrowRight, Tag, Leaf } from 'lucide-react';

export default function RemedyCard({ remedy }) {
  return (
    <Link
      to={`/remedies/${remedy._id}`}
      className="group flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
            <Leaf className="h-4 w-4 text-emerald-700" strokeWidth={1.75} />
          </span>
        </div>

        {/* CATEGORY TAGS */}
        {remedy.categories && remedy.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {remedy.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800"
              >
                <Tag className="h-3 w-3" />
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* REMEDY TITLE */}
        <h2
          className="mt-3 text-xl text-stone-900 transition group-hover:text-emerald-800"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        >
          {remedy.title}
        </h2>

        {/* METADATA */}
        <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-500">
          {remedy.prepTimeMinutes != null && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-stone-400" />
              <span>
                <strong className="font-semibold text-stone-700">Prep time:</strong>{' '}
                {remedy.prepTimeMinutes} mins
              </span>
            </div>
          )}
          {remedy.origin && (
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-stone-400" />
              <span>
                <strong className="font-semibold text-stone-700">Origin:</strong>{' '}
                {remedy.origin}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* LINK FOOTER */}
      <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-semibold text-emerald-800">
        <span>View remedy</span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
