import { ChevronDown, FileUp, History, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddDisbursementModal } from '@/components/dashboard/AddDisbursementModal'
import { CreateCustomViewModal } from '@/components/dashboard/CreateCustomViewModal'
import { DisbursementTable } from '@/components/dashboard/DisbursementTable'
import { GlobalActivityDrawer } from '@/components/dashboard/GlobalActivityDrawer'
import { ImportExcelModal } from '@/components/dashboard/ImportExcelModal'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { Button } from '@/components/ui/Button'
import { useTableStore } from '@/store/table-store'

export function DashboardPage() {
  const setAddDisbursementOpen = useTableStore((s) => s.setAddDisbursementOpen)
  const [activityOpen, setActivityOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6">
      <div className="mb-1 flex items-center gap-1 text-xs text-text-muted">
        <Link to="/rms/dashboard" className="hover:text-text-secondary hover:underline">
          RMS
        </Link>
        <span>/</span>
        <span className="text-text-secondary">Disbursement</span>
      </div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">Disbursement</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setActivityOpen(true)}>
            <History size={14} />
            Activity
          </Button>
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setImportOpen(true)}>
            <FileUp size={14} />
            Import Excel
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5"
            onClick={() => setAddDisbursementOpen(true)}
          >
            <Plus size={14} />
            Add Disbursement
            <ChevronDown size={13} />
          </Button>
        </div>
      </div>

      <div className="mb-5">
        <StatsCards />
      </div>

      <DisbursementTable />
      <AddDisbursementModal />
      <CreateCustomViewModal />
      <GlobalActivityDrawer open={activityOpen} onClose={() => setActivityOpen(false)} />
      <ImportExcelModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}
