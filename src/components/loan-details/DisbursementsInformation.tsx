import { StatusBadge } from '@/components/ui/StatusBadge'
import type { DisbursementLineItem } from '@/types/disbursement'
import { formatCurrency, formatDate } from '@/lib/utils'

export function DisbursementsInformation({ items }: { items: DisbursementLineItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-secondary">
            <th className="pb-2 font-medium">Disbursement ID</th>
            <th className="pb-2 font-medium">Disbursement Date</th>
            <th className="pb-2 font-medium">Disbursement Amount</th>
            <th className="pb-2 font-medium">Verified Disbursement Amount</th>
            <th className="pb-2 font-medium">UTR Number</th>
            <th className="pb-2 font-medium">Tranche</th>
            <th className="pb-2 font-medium">Disbursement Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const mismatch = item.verifiedAmount !== null && item.verifiedAmount !== item.amount
            return (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="py-3 font-medium text-brand-purple">{item.disbursementId}</td>
                <td className="py-3 text-text-primary">{formatDate(item.date)}</td>
                <td className={mismatch ? 'py-3 text-red-500' : 'py-3 text-status-submitted-fg'}>
                  {formatCurrency(item.amount)}
                </td>
                <td className={mismatch ? 'py-3 text-red-500' : 'py-3 text-status-submitted-fg'}>
                  {item.verifiedAmount ? formatCurrency(item.verifiedAmount) : '--'}
                </td>
                <td className="py-3 text-text-secondary">{item.utrNumber}</td>
                <td className="py-3 text-text-secondary">{item.tranche}</td>
                <td className="py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
