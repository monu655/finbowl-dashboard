import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label?: string
  id?: string
}

export function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none text-sm text-text-primary"
    >
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40',
          checked
            ? 'bg-brand-purple border-brand-purple'
            : 'bg-white border-border-strong',
        )}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-white" />}
      </button>
      {label}
    </label>
  )
}
