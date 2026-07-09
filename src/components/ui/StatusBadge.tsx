import type { DisbursementStatus } from '@/types/disbursement'
import { STATUS_STYLES, cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: DisbursementStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium',
        style.bg,
        style.fg,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {status}
    </span>
  )
}
