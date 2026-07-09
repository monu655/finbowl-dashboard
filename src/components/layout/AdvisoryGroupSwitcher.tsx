import { Briefcase, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Popover } from '@/components/ui/Popover'
import { useToastStore } from '@/store/toast-store'
import { cn } from '@/lib/utils'

export function AdvisoryGroupSwitcher({
  name,
  active,
  onToggle,
}: {
  name: string
  active: boolean
  onToggle: () => void
}) {
  const [open, setOpen] = useState(false)
  const addToast = useToastStore((s) => s.addToast)

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs sm:px-3 sm:text-sm',
          active
            ? 'border-brand-purple/40 bg-brand-purple-light text-brand-purple'
            : 'border-border text-text-secondary hover:bg-surface-muted',
        )}
      >
        <Briefcase size={14} />
        <span className="hidden sm:inline">{name}</span>
        <span className="sm:hidden">{name.split(' ')[0]}</span>
        <ChevronDown size={14} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="w-56 p-1.5" align="left">
        <button
          onClick={() => {
            onToggle()
            addToast(`${active ? 'Removed' : 'Added'} ${name} from view`, 'info')
            setOpen(false)
          }}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-muted"
        >
          {active ? 'Remove from view' : 'Add to view'}
          {active && <Check size={14} className="text-brand-purple" />}
        </button>
      </Popover>
    </div>
  )
}
