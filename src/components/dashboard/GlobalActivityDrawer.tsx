import { Drawer } from '@/components/ui/Drawer'
import { ActivityItem } from '@/components/shared/ActivityItem'
import type { ActivityEntry } from '@/types/disbursement'

const GLOBAL_ACTIVITY: ActivityEntry[] = [
  {
    id: 'g1',
    type: 'status',
    actor: 'Amit Sharma',
    timestamp: '20 May, 9:20 AM',
    description: 'LN010-24-1009 status updated',
    from: 'Submitted',
    to: 'Verified',
  },
  {
    id: 'g2',
    type: 'amount',
    actor: 'Priya Sharma',
    timestamp: '19 May, 4:10 PM',
    description: 'LN009-24-1008 disbursed amount updated',
    from: '₹15,00,000.00',
    to: '₹17,00,123.00',
  },
  {
    id: 'g3',
    type: 'created',
    actor: 'Suresh Kumar',
    timestamp: '18 May, 11:02 AM',
    description: 'LN002-24-1001 created as Draft',
  },
  {
    id: 'g4',
    type: 'status',
    actor: 'Neha Gupta',
    timestamp: '17 May, 2:45 PM',
    description: 'LN008-24-1007 status updated',
    from: 'Processed',
    to: 'Audited',
  },
]

export function GlobalActivityDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Activity">
      <div>
        {GLOBAL_ACTIVITY.map((entry) => (
          <ActivityItem key={entry.id} entry={entry} />
        ))}
      </div>
    </Drawer>
  )
}
