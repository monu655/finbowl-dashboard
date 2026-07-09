import { Bell, CircleCheck, FileWarning, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Popover } from '@/components/ui/Popover'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  icon: typeof Bell
  title: string
  description: string
  time: string
  unread: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    icon: CircleCheck,
    title: 'Disbursement Verified',
    description: 'LN001-24-1004 for Vikram Desai was verified.',
    time: '10 min ago',
    unread: true,
  },
  {
    id: 'n2',
    icon: FileWarning,
    title: 'Action needed',
    description: 'LN002-24-1001 is still in Draft — submit before EOD.',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: 'n3',
    icon: TrendingUp,
    title: 'Monthly target reached',
    description: 'Gracia Advisory Group crossed ₹3.6Cr disbursed this month.',
    time: 'Yesterday',
    unread: false,
  },
]

export function NotificationPanel() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative rounded-full p-2 text-text-secondary hover:bg-surface-muted"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="w-80 max-w-[85vw]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={() => setNotifications((n) => n.map((x) => ({ ...x, unread: false })))}
              className="text-xs font-medium text-brand-purple hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon
            return (
              <button
                key={n.id}
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
                  )
                }
                className={cn(
                  'flex w-full gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-surface-muted',
                  n.unread && 'bg-brand-purple-light/40',
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-purple-light text-brand-purple">
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-text-primary">{n.title}</p>
                    {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-purple" />}
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">{n.description}</p>
                  <p className="mt-1 text-xs text-text-muted">{n.time}</p>
                </div>
              </button>
            )
          })}
        </div>
      </Popover>
    </div>
  )
}
