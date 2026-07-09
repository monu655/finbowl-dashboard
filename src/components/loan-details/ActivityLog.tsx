import { Drawer } from '@/components/ui/Drawer'
import { ActivityItem } from '@/components/shared/ActivityItem'
import { useTableStore } from '@/store/table-store'
import type { ActivityEntry } from '@/types/disbursement'

export function ActivityLogDrawer({ activity }: { activity: ActivityEntry[] }) {
  const isOpen = useTableStore((s) => s.isActivityDrawerOpen)
  const setOpen = useTableStore((s) => s.setActivityDrawerOpen)

  return (
    <Drawer open={isOpen} onClose={() => setOpen(false)} title="Activity Logs">
      <div>
        {activity.map((entry) => (
          <ActivityItem key={entry.id} entry={entry} />
        ))}
      </div>
    </Drawer>
  )
}
