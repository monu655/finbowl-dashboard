import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAddDisbursement } from '@/features/disbursement/hooks'
import { useTableStore } from '@/store/table-store'
import { useToastStore } from '@/store/toast-store'
import type { Disbursement } from '@/types/disbursement'

const EMPTY_FORM = {
  applicantName: '',
  loanId: '',
  bankName: '',
  loanType: 'Home Loan',
  sanctionedAmt: '',
  disbursedAmt: '',
  referralPct: '',
  creditExecutive: '',
}

export function AddDisbursementModal() {
  const isOpen = useTableStore((s) => s.isAddDisbursementOpen)
  const setOpen = useTableStore((s) => s.setAddDisbursementOpen)
  const addToast = useToastStore((s) => s.addToast)
  const { mutate, isPending } = useAddDisbursement()
  const [form, setForm] = useState(EMPTY_FORM)

  function update<K extends keyof typeof EMPTY_FORM>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.applicantName || !form.loanId || !form.bankName) return

    const newRow: Disbursement = {
      id: form.loanId,
      loanId: form.loanId,
      disbursementDate: new Date().toISOString().slice(0, 10),
      status: 'Draft',
      applicantName: form.applicantName,
      bankName: form.bankName,
      loanType: form.loanType,
      sanctionedAmt: Number(form.sanctionedAmt) || 0,
      disbursedAmt: Number(form.disbursedAmt) || 0,
      balancedAmt: (Number(form.sanctionedAmt) || 0) - (Number(form.disbursedAmt) || 0),
      verifiedAmt: null,
      referralPct: Number(form.referralPct) || 0,
      creditExecutive: form.creditExecutive || form.applicantName,
      bankLogo: form.bankName.slice(0, 4).toUpperCase(),
    }

    mutate(newRow, {
      onSuccess: () => {
        addToast(`Disbursement ${form.loanId} added as Draft`, 'success')
        setForm(EMPTY_FORM)
        setOpen(false)
      },
    })
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      title="Add Disbursement"
      footer={
        <>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" form="add-disbursement-form" type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : 'Add Disbursement'}
          </Button>
        </>
      }
    >
      <form id="add-disbursement-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Input
          label="Applicant Name"
          placeholder="e.g. Rahul Verma"
          value={form.applicantName}
          onChange={(e) => update('applicantName', e.target.value)}
          required
        />
        <Input
          label="Loan ID"
          placeholder="LN011-24-1010"
          value={form.loanId}
          onChange={(e) => update('loanId', e.target.value)}
          required
        />
        <Input
          label="Bank Name"
          placeholder="e.g. HDFC Bank"
          value={form.bankName}
          onChange={(e) => update('bankName', e.target.value)}
          required
        />
        <Input
          label="Loan Type"
          placeholder="Home Loan"
          value={form.loanType}
          onChange={(e) => update('loanType', e.target.value)}
          required
        />
        <Input
          label="Sanctioned Amount"
          type="number"
          placeholder="0.00"
          value={form.sanctionedAmt}
          onChange={(e) => update('sanctionedAmt', e.target.value)}
          required
        />
        <Input
          label="Disbursed Amount"
          type="number"
          placeholder="0.00"
          value={form.disbursedAmt}
          onChange={(e) => update('disbursedAmt', e.target.value)}
        />
        <Input
          label="Referral %"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.referralPct}
          onChange={(e) => update('referralPct', e.target.value)}
        />
        <Input
          label="Credit Executive"
          placeholder="e.g. Suresh Kumar"
          value={form.creditExecutive}
          onChange={(e) => update('creditExecutive', e.target.value)}
        />
      </form>
    </Modal>
  )
}
