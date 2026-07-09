import { FileSpreadsheet, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToastStore } from '@/store/toast-store'

export function ImportExcelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addToast = useToastStore((s) => s.addToast)

  function handleImport() {
    if (!file) return
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      setFile(null)
      onClose()
      addToast(`Imported disbursements from "${file.name}"`, 'success')
    }, 900)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import Excel"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={importing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImport} disabled={!file || importing}>
            {importing ? 'Importing…' : 'Import'}
          </Button>
        </>
      }
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-border-strong bg-surface-muted px-6 py-10 text-center hover:border-brand-purple/40"
      >
        {file ? (
          <>
            <FileSpreadsheet size={28} className="text-brand-purple" />
            <p className="text-sm font-medium text-text-primary">{file.name}</p>
            <p className="text-xs text-text-secondary">{(file.size / 1024).toFixed(0)} KB · Click to replace</p>
          </>
        ) : (
          <>
            <Upload size={28} className="text-text-muted" />
            <p className="text-sm font-medium text-text-primary">Click to upload a .xlsx or .csv file</p>
            <p className="text-xs text-text-secondary">Max file size 10MB</p>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <p className="mt-3 text-xs text-text-muted">
        Rows must match the standard disbursement template — download it from Export All if you
        need a starting point.
      </p>
    </Modal>
  )
}
