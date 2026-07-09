import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

function getPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1])
  const filtered = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const result: (number | 'ellipsis')[] = []
  filtered.forEach((p, i) => {
    if (i > 0 && p - filtered[i - 1] > 1) result.push('ellipsis')
    result.push(p)
  })
  return result
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const pages = getPageList(page, pageCount)

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        aria-label="First page"
        className="rounded-md border border-border p-1.5 disabled:opacity-40"
      >
        <ChevronsLeft size={14} />
      </button>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="rounded-md border border-border p-1.5 disabled:opacity-40"
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-1 text-xs text-text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'h-7 min-w-7 rounded-md px-1.5 text-xs font-medium',
              p === page
                ? 'bg-brand-purple text-white'
                : 'text-text-secondary hover:bg-surface-muted',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
        className="rounded-md border border-border p-1.5 disabled:opacity-40"
      >
        <ChevronRight size={14} />
      </button>
      <button
        onClick={() => onPageChange(pageCount)}
        disabled={page === pageCount}
        aria-label="Last page"
        className="rounded-md border border-border p-1.5 disabled:opacity-40"
      >
        <ChevronsRight size={14} />
      </button>
    </div>
  )
}
