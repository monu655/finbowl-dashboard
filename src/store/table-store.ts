import { create } from 'zustand'
import type { ColumnKey } from '@/types/disbursement'

export const ALL_COLUMNS: { key: ColumnKey; label: string; defaultVisible: boolean }[] = [
  { key: 'disbursementDate', label: 'Disbursement Date', defaultVisible: true },
  { key: 'loanId', label: 'Loan ID', defaultVisible: true },
  { key: 'applicantName', label: 'Applicant Name', defaultVisible: true },
  { key: 'bankName', label: 'Bank Name', defaultVisible: true },
  { key: 'loanType', label: 'Loan Type', defaultVisible: false },
  { key: 'sanctionedAmt', label: 'Sanctioned Amt', defaultVisible: true },
  { key: 'disbursedAmt', label: 'Disbursed Amt', defaultVisible: false },
  { key: 'balancedAmt', label: 'Balanced Amt', defaultVisible: false },
  { key: 'verifiedAmt', label: 'Verified Amt', defaultVisible: true },
  { key: 'referralPct', label: 'Referral %', defaultVisible: true },
  { key: 'creditExecutive', label: 'Credit Executive', defaultVisible: true },
  { key: 'bank', label: 'Bank', defaultVisible: true },
  { key: 'status', label: 'Status', defaultVisible: true },
]

export const DEFAULT_SAVED_VIEWS = [
  'My Loan View',
  'Priority Loans',
  'Submitted Loans',
  'Draft Applications',
]

interface TableState {
  visibleColumns: Set<ColumnKey>
  searchQuery: string
  statusFilter: string | null
  isColumnMenuOpen: boolean
  isAddDisbursementOpen: boolean
  isActivityDrawerOpen: boolean
  isSavedViewMenuOpen: boolean
  isCreateViewModalOpen: boolean
  savedViews: string[]
  activeSavedView: string | null
  toggleColumn: (key: ColumnKey) => void
  setSearchQuery: (q: string) => void
  setStatusFilter: (status: string | null) => void
  setColumnMenuOpen: (open: boolean) => void
  setAddDisbursementOpen: (open: boolean) => void
  setActivityDrawerOpen: (open: boolean) => void
  setSavedViewMenuOpen: (open: boolean) => void
  setCreateViewModalOpen: (open: boolean) => void
  setActiveSavedView: (view: string | null) => void
  addSavedView: (name: string) => void
}

export const useTableStore = create<TableState>((set) => ({
  visibleColumns: new Set(
    ALL_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.key),
  ),
  searchQuery: '',
  statusFilter: null,
  isColumnMenuOpen: false,
  isAddDisbursementOpen: false,
  isActivityDrawerOpen: false,
  isSavedViewMenuOpen: false,
  isCreateViewModalOpen: false,
  savedViews: DEFAULT_SAVED_VIEWS,
  activeSavedView: 'Default View',
  toggleColumn: (key) =>
    set((state) => {
      const next = new Set(state.visibleColumns)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return { visibleColumns: next }
    }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setColumnMenuOpen: (open) => set({ isColumnMenuOpen: open }),
  setAddDisbursementOpen: (open) => set({ isAddDisbursementOpen: open }),
  setActivityDrawerOpen: (open) => set({ isActivityDrawerOpen: open }),
  setSavedViewMenuOpen: (open) => set({ isSavedViewMenuOpen: open }),
  setCreateViewModalOpen: (open) => set({ isCreateViewModalOpen: open }),
  setActiveSavedView: (view) => set({ activeSavedView: view }),
  addSavedView: (name) =>
    set((state) => ({
      savedViews: state.savedViews.includes(name) ? state.savedViews : [...state.savedViews, name],
      activeSavedView: name,
    })),
}))
