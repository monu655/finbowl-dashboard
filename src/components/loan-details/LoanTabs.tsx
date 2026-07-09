import { cn } from '@/lib/utils'

export interface TabDef {
  key: string
  label: string
}

export function LoanTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <nav
      aria-label="Loan sections"
      className="w-full shrink-0 overflow-x-auto lg:sticky lg:top-6 lg:w-56 lg:self-start lg:overflow-visible"
    >
      <div className="flex gap-1 lg:flex-col lg:gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors lg:whitespace-normal',
              active === tab.key
                ? 'bg-brand-purple-light font-medium text-brand-purple'
                : 'text-text-secondary hover:bg-surface-muted',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
