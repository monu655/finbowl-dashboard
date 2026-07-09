import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDisbursementStats } from '@/features/disbursement/hooks'
import { useTableStore } from '@/store/table-store'
import { cn, formatCompactCurrency } from '@/lib/utils'

export function StatsCards() {
  const { data, isLoading, isError } = useDisbursementStats()
  const statusFilter = useTableStore((s) => s.statusFilter)
  const setStatusFilter = useTableStore((s) => s.setStatusFilter)

  const items = [
    { label: 'Total Disbursements', value: data?.totalDisbursements, filterValue: null },
    {
      label: 'Total Disbursed Amount',
      value: data ? formatCompactCurrency(data.totalDisbursedAmount) : undefined,
      filterValue: null,
    },
    { label: 'Submitted', value: data?.submitted, filterValue: 'Submitted' },
    { label: 'Verified', value: data?.verified, filterValue: 'Verified' },
    { label: 'Processed', value: data?.processed, filterValue: 'Processed' },
    { label: 'Audited', value: data?.audited, filterValue: 'Audited' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => {
        const isFilterable = item.filterValue !== null
        const isActive = isFilterable && statusFilter === item.filterValue
        return (
          <Card
            key={item.label}
            onClick={
              isFilterable
                ? () => setStatusFilter(isActive ? null : (item.filterValue as string))
                : undefined
            }
            className={cn(
              'px-4 py-3.5 transition-shadow',
              isFilterable && 'cursor-pointer hover:shadow-popover',
              isActive && 'ring-2 ring-brand-purple',
            )}
          >
            <p className="text-xs text-text-secondary">{item.label}</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-6 w-16" />
            ) : isError ? (
              <p className="mt-1 text-lg font-semibold text-text-muted">--</p>
            ) : (
              <p
                className={cn(
                  'mt-1 text-lg font-semibold',
                  isActive ? 'text-brand-purple' : 'text-text-primary',
                )}
              >
                {item.value}
              </p>
            )}
          </Card>
        )
      })}
    </div>
  )
}
