import { ArrowUpDown } from 'lucide-react';

export default function SortFilter({ sortOptions, sort, onSortChange }) {
  if (!sortOptions || sortOptions.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-stone-400" />
      <span className="text-sm font-medium text-stone-600">Sort by:</span>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-800 outline-none transition focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
