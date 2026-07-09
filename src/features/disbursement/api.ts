import { mockDisbursements, mockLoanDetail } from '@/lib/mock-data'
import type { Disbursement, DisbursementStats, LoanDetail } from '@/types/disbursement'

const NETWORK_DELAY_MS = 650

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/**
 * Simulates a real API call. In production this would be replaced with a
 * fetch()/axios call to the disbursement service, e.g.
 *   const res = await fetch('/api/v1/disbursements')
 *   if (!res.ok) throw new ApiError(res.status)
 *   return res.json()
 */
export async function fetchDisbursements(): Promise<Disbursement[]> {
  return delay([...mockDisbursements])
}

export async function fetchDisbursementStats(): Promise<DisbursementStats> {
  const list = mockDisbursements
  return delay({
    totalDisbursements: list.length,
    totalDisbursedAmount: 3625000,
    submitted: list.filter((d) => d.status === 'Submitted').length,
    verified: list.filter((d) => d.status === 'Verified').length,
    processed: 5,
    audited: list.filter((d) => d.status === 'Audited').length,
  })
}

export async function fetchLoanDetail(_loanId: string): Promise<LoanDetail> {
  return delay(mockLoanDetail)
}
