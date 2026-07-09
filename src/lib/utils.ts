import { clsx, type ClassValue } from 'clsx'
import type { DisbursementStatus } from '@/types/disbursement'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '--'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export const STATUS_STYLES: Record<
  DisbursementStatus,
  { bg: string; fg: string; dot: string }
> = {
  Draft: { bg: 'bg-status-draft-bg', fg: 'text-status-draft-fg', dot: 'bg-text-muted' },
  Submitted: {
    bg: 'bg-status-submitted-bg',
    fg: 'text-status-submitted-fg',
    dot: 'bg-status-submitted-fg',
  },
  Verified: {
    bg: 'bg-status-verified-bg',
    fg: 'text-status-verified-fg',
    dot: 'bg-status-verified-fg',
  },
  Processed: {
    bg: 'bg-status-processed-bg',
    fg: 'text-status-processed-fg',
    dot: 'bg-status-processed-fg',
  },
  Audited: {
    bg: 'bg-status-audited-bg',
    fg: 'text-status-audited-fg',
    dot: 'bg-status-audited-fg',
  },
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
