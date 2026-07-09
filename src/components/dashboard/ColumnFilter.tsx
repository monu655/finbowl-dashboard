import { ListFilter } from 'lucide-react'
import { useState } from 'react'
import type { Column } from '@tanstack/react-table'
import { Popover } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function ColumnFilter<T>({ column }: { column: Column<T, unknown> }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState((column.getFilterValue() as string) ?? '')
  const isActive = Boolean(column.getFilterValue())

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Filter ${String(column.id)}`}
        className={cn(
          'rounded p-0.5 hover:text-text-primary',
          isActive ? 'text-brand-purple' : 'text-text-muted',
        )}
      >
        <ListFilter size={12} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} className="w-48 p-2.5" align="left">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              column.setFilterValue(value || undefined)
              setOpen(false)
            }
          }}
          placeholder="Filter value…"
          className="h-8 w-full rounded-md border border-border px-2 text-xs focus:border-brand-purple focus:outline-none"
        />
        <div className="mt-2 flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              setValue('')
              column.setFilterValue(undefined)
              setOpen(false)
            }}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              column.setFilterValue(value || undefined)
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
