import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useEffect } from 'react'
import { useToastStore } from '@/store/toast-store'
import { cn } from '@/lib/utils'

const ICONS = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
}

const COLORS = {
  success: 'border-status-submitted-fg/30 text-status-submitted-fg',
  error: 'border-red-300 text-red-600',
  info: 'border-status-verified-fg/30 text-status-verified-fg',
}

function ToastItem({ id, message, type }: { id: string; message: string; type: 'success' | 'error' | 'info' }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const Icon = ICONS[type]

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 3200)
    return () => clearTimeout(timer)
  }, [id, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      className={cn(
        'flex items-center gap-2.5 rounded-card border bg-white px-4 py-3 text-sm shadow-popover',
        COLORS[type],
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="text-text-primary">{message}</span>
      <button
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
        className="ml-2 shrink-0 text-text-muted hover:text-text-primary"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-xs flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
