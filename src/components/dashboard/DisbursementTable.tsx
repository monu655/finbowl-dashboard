import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Download, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EditableStatusBadge } from '@/components/ui/EditableStatusBadge'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/StateViews'
import { ColumnFilter } from '@/components/dashboard/ColumnFilter'
import { ColumnVisibilityMenu } from '@/components/dashboard/ColumnVisibilityMenu'
import { SavedViewMenu } from '@/components/dashboard/SavedViewMenu'
import {
  useDeleteDisbursements,
  useDisbursements,
  useUpdateDisbursementStatus,
} from '@/features/disbursement/hooks'
import { ALL_COLUMNS, useTableStore } from '@/store/table-store'
import { useToastStore } from '@/store/toast-store'
import type { Disbursement } from '@/types/disbursement'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

function exportToCsv(rows: Disbursement[]) {
  const headers = ALL_COLUMNS.map((c) => c.label).join(',')
  const lines = rows.map((row) =>
    [
      formatDate(row.disbursementDate),
      row.loanId,
      row.applicantName,
      row.bankName,
      row.loanType,
      row.sanctionedAmt,
      row.disbursedAmt,
      row.balancedAmt,
      row.verifiedAmt ?? '',
      row.referralPct,
      row.creditExecutive,
      row.bankName,
      row.status,
    ].join(','),
  )
  const csv = [headers, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'disbursements.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function DisbursementTable() {
  const { data, isLoading, isError, refetch } = useDisbursements()
  const navigate = useNavigate()
  const visibleColumns = useTableStore((s) => s.visibleColumns)
  const searchQuery = useTableStore((s) => s.searchQuery)
  const setSearchQuery = useTableStore((s) => s.setSearchQuery)
  const statusFilter = useTableStore((s) => s.statusFilter)
  const setStatusFilter = useTableStore((s) => s.setStatusFilter)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const addToast = useToastStore((s) => s.addToast)
  const updateStatus = useUpdateDisbursementStatus()
  const deleteRows = useDeleteDisbursements()

  const columns = useMemo<ColumnDef<Disbursement>[]>(
    () => [
      {
        id: 'select',
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onChange={() => table.toggleAllPageRowsSelected()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox checked={row.getIsSelected()} onChange={() => row.toggleSelected()} />
        ),
        size: 36,
      },
      {
        accessorKey: 'disbursementDate',
        header: 'Disbursement Date',
        cell: ({ getValue }) => formatDate(getValue<string>()),
      },
      {
        accessorKey: 'loanId',
        header: 'Loan ID',
        cell: ({ row, getValue }) => (
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/loans/${row.original.loanId}`)
            }}
            className="font-medium text-brand-purple hover:underline"
          >
            {getValue<string>()}
          </button>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row, getValue }) => (
          <EditableStatusBadge
            status={getValue<Disbursement['status']>()}
            onChange={(next) =>
              updateStatus.mutate(
                { id: row.original.id, status: next },
                {
                  onSuccess: () =>
                    addToast(`${row.original.loanId} marked as ${next}`, 'success'),
                },
              )
            }
          />
        ),
      },
      { accessorKey: 'applicantName', header: 'Applicant Name' },
      { accessorKey: 'loanType', header: 'Loan Type' },
      {
        accessorKey: 'sanctionedAmt',
        header: 'Sanctioned Amt',
        cell: ({ getValue }) => formatCurrency(getValue<number>()),
      },
      {
        accessorKey: 'disbursedAmt',
        header: 'Disbursed Amt',
        cell: ({ getValue }) => formatCurrency(getValue<number>()),
      },
      {
        accessorKey: 'balancedAmt',
        header: 'Balanced Amt',
        cell: ({ getValue }) => formatCurrency(getValue<number>()),
      },
      {
        accessorKey: 'verifiedAmt',
        header: 'Verified',
        cell: ({ getValue }) => {
          const v = getValue<number | null>()
          return v ? (
            <span className="text-status-processed-fg">{formatCurrency(v)}</span>
          ) : (
            <span className="text-text-muted">--</span>
          )
        },
      },
      {
        accessorKey: 'referralPct',
        header: 'Referral %',
        cell: ({ getValue }) => `${getValue<number>().toFixed(4)}%`,
      },
      { accessorKey: 'creditExecutive', header: 'Credit Executive' },
      { accessorKey: 'bankName', header: 'Bank' },
    ],
    [navigate, updateStatus, addToast],
  )

  const columnVisibility = useMemo(() => {
    const visibility: Record<string, boolean> = { select: true, status: visibleColumns.has('status') }
    ALL_COLUMNS.forEach((c) => {
      visibility[c.key] = visibleColumns.has(c.key)
    })
    return visibility
  }, [visibleColumns])

  const table = useReactTable({
    data: data ?? [],
    columns,
    defaultColumn: { filterFn: 'includesString' },
    state: {
      globalFilter: searchQuery,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.id,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  // Apply the stat-card status filter on top of TanStack's own state
  const statusFilteredRows = statusFilter
    ? table.getFilteredRowModel().rows.filter((r) => r.original.status === statusFilter)
    : null

  const displayRows = statusFilteredRows
    ? statusFilteredRows.slice(
        table.getState().pagination.pageIndex * table.getState().pagination.pageSize,
        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
      )
    : table.getRowModel().rows

  const totalFilteredCount = statusFilteredRows ? statusFilteredRows.length : table.getFilteredRowModel().rows.length
  const pageSize = table.getState().pagination.pageSize
  const pageCount = Math.max(1, Math.ceil(totalFilteredCount / pageSize))
  const currentPage = table.getState().pagination.pageIndex + 1

  const selectedIds = Object.keys(rowSelection)
  const selectedCount = selectedIds.length

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Disbursement"
            aria-label="Search for Disbursement"
            className="h-9 w-full rounded-md border border-border bg-white pl-8 pr-10 text-sm placeholder:text-text-muted focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
            ⌘K
          </kbd>
        </div>
        <div className="flex items-center gap-2">
          <SavedViewMenu />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => data && exportToCsv(data)}
            disabled={!data?.length}
            className="gap-1.5"
          >
            <Download size={14} />
            Export All
          </Button>
          <div className="rounded-md border border-border">
            <ColumnVisibilityMenu compact />
          </div>
        </div>
      </div>

      {(statusFilter || columnFilters.length > 0) && (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              className="flex items-center gap-1 rounded-pill bg-brand-purple-light px-2.5 py-1 font-medium text-brand-purple hover:opacity-80"
            >
              Status: {statusFilter} ✕
            </button>
          )}
          {columnFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setColumnFilters((prev) => prev.filter((x) => x.id !== f.id))}
              className="flex items-center gap-1 rounded-pill bg-surface-muted px-2.5 py-1 font-medium text-text-secondary hover:opacity-80"
            >
              {f.id}: {String(f.value)} ✕
            </button>
          ))}
        </div>
      )}

      {selectedCount > 0 && (
        <div className="mb-2 flex items-center justify-between rounded-md bg-brand-purple-light px-3 py-2 text-sm text-brand-purple">
          <span>{selectedCount} selected</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="flex items-center gap-1 font-medium text-red-600 hover:underline"
            >
              <Trash2 size={13} />
              Delete
            </button>
            <button className="font-medium hover:underline" onClick={() => setRowSelection({})}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-card border border-border bg-white">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-surface-muted">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-medium text-text-secondary"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        <button
                          className={cn(
                            'flex items-center gap-1',
                            header.column.getCanSort() && 'cursor-pointer hover:text-text-primary',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && header.id !== 'select' && (
                            <ArrowUpDown size={11} className="opacity-50" />
                          )}
                        </button>
                        {header.id !== 'select' && <ColumnFilter column={header.column} />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {table.getVisibleLeafColumns().map((col) => (
                    <td key={col.id} className="px-3 py-3">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading &&
              !isError &&
              displayRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(`/loans/${row.original.loanId}`)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      onClick={(e) => {
                        if (cell.column.id === 'select') e.stopPropagation()
                      }}
                      className="whitespace-nowrap px-3 py-3 text-text-primary"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>

        {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && data?.length === 0 && (
          <EmptyState
            title="No disbursements yet"
            description="Add your first disbursement to see it listed here."
          />
        )}
        {!isLoading && !isError && (data?.length ?? 0) > 0 && displayRows.length === 0 && (
          <EmptyState
            title="No matching disbursements"
            description="Try adjusting your search or filters."
          />
        )}
      </div>

      {!isLoading && !isError && (data?.length ?? 0) > 0 && displayRows.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-text-secondary">
          <span>
            Page {currentPage} of {pageCount}
          </span>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs">
              Rows per page
              <select
                value={pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="rounded-md border border-border bg-white px-1.5 py-1 text-xs"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onPageChange={(p) => table.setPageIndex(p - 1)}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete disbursements"
        description={`This will permanently delete ${selectedCount} disbursement${selectedCount === 1 ? '' : 's'}. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          deleteRows.mutate(selectedIds, {
            onSuccess: () => {
              addToast(`Deleted ${selectedIds.length} disbursement(s)`, 'success')
              setRowSelection({})
            },
          })
        }}
      />
    </div>
  )
}
