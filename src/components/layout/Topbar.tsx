import { Menu } from 'lucide-react'
import { useState } from 'react'
import { AdvisoryGroupSwitcher } from './AdvisoryGroupSwitcher'
import { NotificationPanel } from './NotificationPanel'
import { ProfileMenu } from './ProfileMenu'
import { advisoryGroups } from '@/lib/mock-data'
import { useUiStore } from '@/store/ui-store'

export function Topbar({ userName = 'Suresh Kumar' }: { userName?: string }) {
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen)
  const [activeGroups, setActiveGroups] = useState<Set<string>>(new Set(advisoryGroups))

  return (
    <header className="flex items-center justify-between gap-2 border-b border-border bg-white px-3 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="shrink-0 rounded-md p-2 text-text-secondary hover:bg-surface-muted lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          {advisoryGroups.map((group) => (
            <AdvisoryGroupSwitcher
              key={group}
              name={group}
              active={activeGroups.has(group)}
              onToggle={() =>
                setActiveGroups((prev) => {
                  const next = new Set(prev)
                  if (next.has(group)) next.delete(group)
                  else next.add(group)
                  return next
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <NotificationPanel />
        <ProfileMenu userName={userName} />
      </div>
    </header>
  )
}
