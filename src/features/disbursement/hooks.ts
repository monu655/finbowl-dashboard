import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchDisbursementStats, fetchDisbursements, fetchLoanDetail } from './api'
import type { Disbursement, DisbursementStatus } from '@/types/disbursement'

export function useDisbursements() {
  return useQuery({
    queryKey: ['disbursements'],
    queryFn: fetchDisbursements,
    staleTime: 30_000,
  })
}

export function useDisbursementStats() {
  return useQuery({
    queryKey: ['disbursement-stats'],
    queryFn: fetchDisbursementStats,
    staleTime: 30_000,
  })
}

export function useLoanDetail(loanId: string) {
  return useQuery({
    queryKey: ['loan-detail', loanId],
    queryFn: () => fetchLoanDetail(loanId),
    enabled: Boolean(loanId),
  })
}

export function useAddDisbursement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (row: Disbursement) => {
      await new Promise((r) => setTimeout(r, 400))
      return row
    },
    onSuccess: (row) => {
      queryClient.setQueryData<Disbursement[]>(['disbursements'], (prev) =>
        prev ? [row, ...prev] : [row],
      )
    },
  })
}

export function useDeleteDisbursements() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await new Promise((r) => setTimeout(r, 300))
      return ids
    },
    onSuccess: (ids) => {
      queryClient.setQueryData<Disbursement[]>(['disbursements'], (prev) =>
        prev ? prev.filter((d) => !ids.includes(d.id)) : prev,
      )
    },
  })
}

export function useUpdateDisbursementStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DisbursementStatus }) => {
      await new Promise((r) => setTimeout(r, 250))
      return { id, status }
    },
    onSuccess: ({ id, status }) => {
      queryClient.setQueryData<Disbursement[]>(['disbursements'], (prev) =>
        prev ? prev.map((d) => (d.id === id ? { ...d, status } : d)) : prev,
      )
    },
  })
}
