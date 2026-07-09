import { Columns3 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Popover } from '@/components/ui/Popover'
import { ALL_COLUMNS, useTableStore } from '@/store/table-store'

export function ColumnVisibilityMenu({ compact = false }: { compact?: boolean }) {
  const [search, setSearch] = useState('')
  const isOpen = useTableStore((s) => s.isColumnMenuOpen)
  const setOpen = useTableStore((s) => s.setColumnMenuOpen)
  const visibleColumns = useTableStore((s) => s.visibleColumns)
  const toggleColumn = useTableStore((s) => s.toggleColumn)
  const setCreateViewOpen = useTableStore((s) => s.setCreateViewModalOpen)

  const filtered = ALL_COLUMNS.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="relative">
      {compact ? (
        <button
          onClick={() => setOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Manage columns"
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-surface-muted"
        >
          <Columns3 size={15} />
        </button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className="gap-1.5"
        >
          <Columns3 size={14} />
          Columns
        </Button>
      )}
      <Popover open={isOpen} onClose={() => setOpen(false)} className="w-64 p-3">
        <Input
          placeholder="Search for Loans"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-64 space-y-2 overflow-y-auto py-1">
          {filtered.map((col) => (
            <Checkbox
              key={col.key}
              id={`col-${col.key}`}
              checked={visibleColumns.has(col.key)}
              onChange={() => toggleColumn(col.key)}
              label={col.label}
            />
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
              setOpen(false)
              setCreateViewOpen(true)
            }}
          >
            Save View
          </Button>
        </div>
      </Popover>
    </div>
  )
}
