import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useToastStore } from '@/store/toast-store'
import type { LoanDetail } from '@/types/disbursement'

export function EditLoanModal({
  open,
  onClose,
  loan,
  onSave,
}: {
  open: boolean
  onClose: () => void
  loan: LoanDetail
  onSave: (patch: Partial<LoanDetail>) => void
}) {
  const addToast = useToastStore((s) => s.addToast)
  const [applicantName, setApplicantName] = useState(loan.applicantName)
  const [bank, setBank] = useState(loan.bank)
  const [bankExecutiveName, setBankExecutiveName] = useState(loan.bankExecutiveName)
  const [saving, setSaving] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      onSave({ applicantName, bank, bankExecutiveName })
      setSaving(false)
      onClose()
      addToast('Loan details updated', 'success')
    }, 500)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Loan"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="edit-loan-form" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form id="edit-loan-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Applicant Name"
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
          required
        />
        <Input label="Bank" value={bank} onChange={(e) => setBank(e.target.value)} required />
        <Input
          label="Bank Executive Name"
          value={bankExecutiveName}
          onChange={(e) => setBankExecutiveName(e.target.value)}
        />
      </form>
    </Modal>
  )
}
