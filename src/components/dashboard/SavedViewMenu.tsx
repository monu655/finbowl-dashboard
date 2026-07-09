import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Popover } from '@/components/ui/Popover'
import { useTableStore } from '@/store/table-store'

export function SavedViewMenu() {
  const isOpen = useTableStore((s) => s.isSavedViewMenuOpen)
  const setOpen = useTableStore((s) => s.setSavedViewMenuOpen)
  const savedViews = useTableStore((s) => s.savedViews)
  const activeSavedView = useTableStore((s) => s.activeSavedView)
  const setActiveSavedView = useTableStore((s) => s.setActiveSavedView)

  const [pending, setPending] = useState<string | null>(activeSavedView)

  function openMenu() {
    setPending(activeSavedView)
    setOpen(!isOpen)
  }

  const options = ['Default View', ...savedViews]

  return (
    <div className="relative">
      <Button variant="secondary" size="sm" onClick={openMenu} className="gap-1.5">
        Saved View
        <ChevronDown size={14} />
      </Button>
      <Popover open={isOpen} onClose={() => setOpen(false)} className="w-56 p-3">
        <div className="space-y-1">
          {options.map((view) => (
            <label
              key={view}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-primary hover:bg-surface-muted"
            >
              <input
                type="radio"
                name="saved-view"
                checked={pending === view}
                onChange={() => setPending(view)}
                className="h-3.5 w-3.5 accent-brand-purple"
              />
              {view}
            </label>
          ))}
        </div>
        <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setActiveSavedView(pending)
              setOpen(false)
            }}
          >
            Apply
          </Button>
        </div>
      </Popover>
    </div>
  )
}
