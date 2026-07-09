import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Popover } from './Popover'
import { STATUS_STYLES, cn } from '@/lib/utils'
import type { DisbursementStatus } from '@/types/disbursement'

const ALL_STATUSES: DisbursementStatus[] = [
  'Draft',
  'Submitted',
  'Verified',
  'Processed',
  'Audited',
]

export function EditableStatusBadge({
  status,
  onChange,
}: {
  status: DisbursementStatus
  onChange: (next: DisbursementStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const style = STATUS_STYLES[status]

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80',
          style.bg,
          style.fg,
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
        {status}
        <ChevronDown size={11} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="w-40 p-1.5">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              onChange(s)
              setOpen(false)
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-surface-muted',
              s === status && 'font-medium text-brand-purple',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_STYLES[s].dot)} />
            {s}
          </button>
        ))}
      </Popover>
    </div>
  )
}
