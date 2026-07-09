import { Archive, History, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { EditableStatusBadge } from '@/components/ui/EditableStatusBadge'
import { Toggle } from '@/components/ui/Toggle'
import { EditLoanModal } from '@/components/loan-details/EditLoanModal'
import { useTableStore } from '@/store/table-store'
import { useToastStore } from '@/store/toast-store'
import type { LoanDetail } from '@/types/disbursement'
import { formatCurrency, initials } from '@/lib/utils'

export function LoanSummaryHeader({ loan }: { loan: LoanDetail }) {
  const setActivityOpen = useTableStore((s) => s.setActivityDrawerOpen)
  const addToast = useToastStore((s) => s.addToast)
  const queryClient = useQueryClient()
  const [showTiles, setShowTiles] = useState(true)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  function patchLoan(patch: Partial<LoanDetail>) {
    queryClient.setQueryData<LoanDetail>(['loan-detail', loan.loanId], (prev) =>
      prev ? { ...prev, ...patch } : prev,
    )
  }

  const netIncome = loan.commissionIncome + loan.referralFee

  const stats = [
    { label: 'Total Sanctioned Amount', value: loan.totalSanctionedAmount, tone: 'default' as const },
    { label: 'Total Disbursement Amount', value: loan.totalDisbursedAmount, tone: 'default' as const },
    { label: 'Commission Income', value: loan.commissionIncome, tone: 'default' as const },
    { label: 'Referral Fee', value: loan.referralFee, tone: 'default' as const },
    { label: 'Net Income', value: netIncome, tone: 'success' as const },
  ]

  return (
    <div className="mb-5">
      <div className="mb-2 flex flex-wrap items-center gap-1 text-xs text-text-muted">
        <Link to="/rms/dashboard" className="hover:text-text-secondary hover:underline">
          RMS
        </Link>
        <span>/</span>
        <Link to="/disbursement" className="hover:text-text-secondary hover:underline">
          Disbursement
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{loan.applicantName}</span>
      </div>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple-light text-sm font-semibold text-brand-purple">
            {initials(loan.applicantName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary">{loan.applicantName}</h1>
              <EditableStatusBadge
                status={loan.status}
                onChange={(next) => {
                  patchLoan({ status: next })
                  addToast(`Loan status updated to ${next}`, 'success')
                }}
              />
            </div>
            <p className="text-xs text-text-secondary">{loan.homeLoanLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setArchiveOpen(true)}>
            <Archive size={14} />
            Archive
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={() => setActivityOpen(true)}
          >
            <History size={14} />
            Activity Logs
          </Button>
          <Button variant="primary" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
            <SquarePen size={14} />
            Edit Loan
          </Button>
        </div>
      </div>

      <div className="mb-3 flex justify-end">
        <Toggle checked={showTiles} onChange={() => setShowTiles((v) => !v)} label="Summary Tiles" />
      </div>

      {showTiles && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className={
                s.tone === 'success'
                  ? 'rounded-card border border-status-submitted-fg/20 bg-status-submitted-bg px-4 py-3'
                  : 'rounded-card border border-border bg-white px-4 py-3'
              }
            >
              <p className="text-xs text-text-secondary">{s.label}</p>
              <p
                className={
                  s.tone === 'success'
                    ? 'mt-1 text-base font-semibold text-status-submitted-fg'
                    : 'mt-1 text-base font-semibold text-text-primary'
                }
              >
                {formatCurrency(s.value)}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title="Archive this loan?"
        description={`${loan.loanId} will be moved to the archive. You can restore it later from Disbursement > Archived.`}
        confirmLabel="Archive"
        onConfirm={() => addToast(`${loan.loanId} archived`, 'success')}
      />

      <EditLoanModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        loan={loan}
        onSave={patchLoan}
      />
    </div>
  )
}
