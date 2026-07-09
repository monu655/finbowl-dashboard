import { CirclePlus, RefreshCcw, Wallet } from 'lucide-react'
import type { ActivityEntry } from '@/types/disbursement'
import { initials } from '@/lib/utils'

const ICONS = {
  created: CirclePlus,
  status: RefreshCcw,
  amount: Wallet,
}

export function ActivityItem({ entry }: { entry: ActivityEntry }) {
  const Icon = ICONS[entry.type]
  return (
    <div className="flex gap-3 pb-6">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-purple-light text-brand-purple">
          <Icon size={14} />
        </div>
        <div className="mt-1 w-px flex-1 bg-border" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">{entry.description}</p>
          <span className="text-xs text-text-muted">{entry.timestamp}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-surface-muted text-[9px] font-medium">
            {initials(entry.actor)}
          </span>
          {entry.actor}
        </div>
        {entry.from && entry.to && (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2 text-xs">
            <span className="text-text-muted">From</span>
            <span className="rounded-pill bg-white px-2 py-0.5 font-medium text-text-secondary">
              {entry.from}
            </span>
            <span className="text-text-muted">To</span>
            <span className="rounded-pill bg-status-verified-bg px-2 py-0.5 font-medium text-status-verified-fg">
              {entry.to}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
