import type { BrokerLineItem } from '@/types/disbursement'
import { cn, formatCurrency } from '@/lib/utils'

function PayoutBadge({ status }: { status: 'Paid' | 'Pending' }) {
  return (
    <span
      className={cn(
        'rounded-pill px-2.5 py-1 text-xs font-medium',
        status === 'Paid'
          ? 'bg-status-submitted-bg text-status-submitted-fg'
          : 'bg-status-processed-bg text-status-processed-fg',
      )}
    >
      {status}
    </span>
  )
}

export function BrokerInformation({ entries }: { entries: BrokerLineItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-secondary">
            <th className="pb-2 font-medium">Broker Name / Code</th>
            <th className="pb-2 font-medium">Broker Commission %</th>
            <th className="pb-2 font-medium">Referral Fee</th>
            <th className="pb-2 font-medium">PO No &amp; Date</th>
            <th className="pb-2 font-medium">PO Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-border last:border-0">
              <td className="py-3">
                <p className="text-text-primary">{entry.brokerName}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
                  {entry.brokerCode}
                  <span className="rounded-pill bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">
                    {entry.brokerType}
                  </span>
                </p>
              </td>
              <td className="py-3 text-text-secondary">{entry.brokerCommissionPct.toFixed(2)}%</td>
              <td className="py-3 text-status-submitted-fg">{formatCurrency(entry.referralFee)}</td>
              <td className="py-3">
                <span className="font-medium text-brand-purple">{entry.poNumber}</span>{' '}
                <span className="text-text-muted">{entry.poDate}</span>
              </td>
              <td className="py-3">
                <PayoutBadge status={entry.poStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
