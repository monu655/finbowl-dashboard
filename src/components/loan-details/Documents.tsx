import { FileText } from 'lucide-react'
import type { LoanDocument } from '@/types/disbursement'
import { useToastStore } from '@/store/toast-store'

export function Documents({ documents }: { documents: LoanDocument[] }) {
  const addToast = useToastStore((s) => s.addToast)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => addToast(`Downloading ${doc.name}…`, 'info')}
          className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-left hover:bg-surface-muted"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500">
            <FileText size={16} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">{doc.name}</p>
            <p className="text-xs text-text-muted">{doc.sizeKb} KB</p>
          </div>
        </button>
      ))}
    </div>
  )
}
