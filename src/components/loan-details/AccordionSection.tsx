import { ChevronUp } from 'lucide-react'
import { forwardRef, type ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface AccordionSectionProps {
  title: string
  icon: ReactNode
  badge?: ReactNode
  collapsed: boolean
  onToggle: () => void
  children: ReactNode
}

export const AccordionSection = forwardRef<HTMLDivElement, AccordionSectionProps>(
  ({ title, icon, badge, collapsed, onToggle, children }, ref) => {
    return (
      <Card ref={ref} className="scroll-mt-4 overflow-hidden p-0">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left hover:bg-surface-muted"
          aria-expanded={!collapsed}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <span className="text-text-secondary">{icon}</span>
            {title}
            {badge}
          </span>
          <ChevronUp
            size={16}
            className={cn('shrink-0 text-text-muted transition-transform', collapsed && 'rotate-180')}
          />
        </button>
        {!collapsed && <div className="border-t border-border px-5 py-4">{children}</div>}
      </Card>
    )
  },
)
AccordionSection.displayName = 'AccordionSection'
