import { LogOut, Settings, UserCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Popover } from '@/components/ui/Popover'
import { useToastStore } from '@/store/toast-store'
import { initials } from '@/lib/utils'

export function ProfileMenu({ userName = 'Suresh Kumar' }: { userName?: string }) {
  const [open, setOpen] = useState(false)
  const addToast = useToastStore((s) => s.addToast)
  const navigate = useNavigate()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Profile menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple-light text-xs font-semibold text-brand-purple hover:ring-2 hover:ring-brand-purple/30"
      >
        {initials(userName)}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="w-56 p-1.5">
        <div className="border-b border-border px-3 py-2.5">
          <p className="text-sm font-medium text-text-primary">{userName}</p>
          <p className="text-xs text-text-secondary">Credit Executive · Gracia Advisory</p>
        </div>
        <button
          onClick={() => {
            setOpen(false)
            navigate('/settings')
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-muted"
        >
          <UserCircle size={15} />
          View Profile
        </button>
        <button
          onClick={() => {
            setOpen(false)
            navigate('/settings')
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-muted"
        >
          <Settings size={15} />
          Settings
        </button>
        <button
          onClick={() => {
            setOpen(false)
            addToast('Signed out successfully', 'info')
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut size={15} />
          Log Out
        </button>
      </Popover>
    </div>
  )
}
