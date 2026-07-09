import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { MODULE_CONTENT, type ModuleListItem } from '@/lib/module-content'
import { cn } from '@/lib/utils'

const TONE_STYLES: Record<ModuleListItem['statusTone'], string> = {
  success: 'bg-status-submitted-bg text-status-submitted-fg',
  warning: 'bg-status-processed-bg text-status-processed-fg',
  info: 'bg-status-verified-bg text-status-verified-fg',
  neutral: 'bg-status-draft-bg text-status-draft-fg',
}

const CRUMB_LINKS: Record<string, string> = {
  RMS: '/rms/dashboard',
}

export function ModuleOverviewPage({ moduleKey }: { moduleKey: string }) {
  const content = MODULE_CONTENT[moduleKey]
  const [selected, setSelected] = useState<ModuleListItem | null>(null)

  if (!content) return null

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6">
      <div className="mb-1 flex flex-wrap items-center gap-1 text-xs text-text-muted">
        {content.breadcrumb.map((crumb, i) => {
          const isLast = i === content.breadcrumb.length - 1
          const href = !isLast ? CRUMB_LINKS[crumb] : undefined
          return (
            <span key={crumb} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              {href ? (
                <Link to={href} className="hover:text-text-secondary hover:underline">
                  {crumb}
                </Link>
              ) : (
                <span className={isLast ? 'text-text-secondary' : ''}>{crumb}</span>
              )}
            </span>
          )
        })}
      </div>
      <h1 className="mb-1 text-xl font-semibold text-text-primary sm:text-2xl">{content.title}</h1>
      <p className="mb-5 text-sm text-text-secondary">{content.description}</p>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {content.stats.map((s) => (
          <Card key={s.label} className="px-4 py-3.5">
            <p className="text-xs text-text-secondary">{s.label}</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">{content.listTitle}</h2>
        <div className="divide-y divide-border">
          {content.listItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-surface-muted"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{item.name}</p>
                <p className="mt-0.5 truncate text-xs text-text-secondary">{item.meta}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-pill px-2.5 py-1 text-xs font-medium',
                  TONE_STYLES[item.statusTone],
                )}
              >
                {item.status}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <p className="mt-4 text-xs text-text-muted">
        Looking for disbursement data?{' '}
        <Link to="/disbursement" className="font-medium text-brand-purple hover:underline">
          Go to Disbursement
        </Link>
      </p>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        footer={
          <Button variant="primary" onClick={() => setSelected(null)}>
            Close
          </Button>
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-text-secondary">Status</p>
              <span
                className={cn(
                  'mt-1 inline-block rounded-pill px-2.5 py-1 text-xs font-medium',
                  TONE_STYLES[selected.statusTone],
                )}
              >
                {selected.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Details</p>
              <p className="mt-1 text-text-primary">{selected.meta}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
