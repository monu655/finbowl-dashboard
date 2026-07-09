import type { LoanDetail } from '@/types/disbursement'
import { formatCurrency, formatDate } from '@/lib/utils'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
    </div>
  )
}

export function LoanDetailsSection({ loan }: { loan: LoanDetail }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <Field label="Loan ID" value={loan.loanId} />
        <Field label="Loan Type" value={loan.loanType} />
        <Field label="Bank" value={loan.bank} />
        <Field label="Stage" value={loan.stage} />
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
          Sanction Details
        </p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <Field label="Sanctioned Date" value={formatDate(loan.sanctionDate)} />
          <Field label="Loan Sanctioned Amount" value={formatCurrency(loan.loanSanctionedAmount)} />
          <Field
            label="Verified Sanctioned Amount"
            value={formatCurrency(loan.verifiedSanctionedAmount)}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
          Team Details
        </p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <Field label="Bank Executive Name" value={loan.bankExecutiveName} />
          <Field label="Credit Executive Details" value={loan.creditExecutiveDetails} />
          <Field label="Source" value={loan.source} />
        </div>
      </div>
    </div>
  )
}
