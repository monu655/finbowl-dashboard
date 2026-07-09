import { cn } from '@/lib/utils'

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label?: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 select-none text-sm text-text-primary">
      {label && <span>{label}</span>}
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-pill transition-colors',
          checked ? 'bg-brand-purple' : 'bg-border-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  )
}
