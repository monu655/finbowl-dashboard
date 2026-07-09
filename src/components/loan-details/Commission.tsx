import type { CommissionLineItem } from '@/types/disbursement'
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

export function Commission({ entries }: { entries: CommissionLineItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-secondary">
            <th className="pb-2 font-medium">Party Name (Used Code)</th>
            <th className="pb-2 font-medium">Sub-Code Commission (Net)%</th>
            <th className="pb-2 font-medium">Gross Commission %</th>
            <th className="pb-2 font-medium">Commission Amount</th>
            <th className="pb-2 font-medium">Invoice No</th>
            <th className="pb-2 font-medium">Invoice Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-border last:border-0">
              <td className="py-3 text-text-primary">{entry.partyName}</td>
              <td className="py-3 text-text-secondary">{entry.subCodeCommissionPct.toFixed(4)}%</td>
              <td className="py-3 text-text-secondary">{entry.grossCommissionPct.toFixed(4)}%</td>
              <td className="py-3 text-status-submitted-fg">{formatCurrency(entry.commissionAmt)}</td>
              <td className="py-3 font-medium text-brand-purple">{entry.invoiceNo}</td>
              <td className="py-3">
                <PayoutBadge status={entry.invoiceStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
