import { FileSearch, RefreshCw, TriangleAlert } from 'lucide-react'
import { Button } from './Button'

export function EmptyState({
  title = 'No disbursements yet',
  description = 'Add your first disbursement to see it listed here.',
  actionLabel,
  onAction,
}: {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
        <FileSearch size={22} className="text-text-muted" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <TriangleAlert size={22} className="text-red-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">Couldn&apos;t load disbursements</p>
        <p className="mt-1 text-sm text-text-secondary">
          Something went wrong while fetching data. Check your connection and try again.
        </p>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry} className="gap-1.5">
        <RefreshCw size={14} />
        Retry
      </Button>
    </div>
  )
}
