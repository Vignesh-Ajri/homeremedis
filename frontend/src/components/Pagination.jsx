import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-emerald-700 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-stone-600"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <span className="text-sm font-medium text-stone-600">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-emerald-700 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-stone-600"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
