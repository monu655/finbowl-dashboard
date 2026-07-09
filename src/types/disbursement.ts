export type DisbursementStatus =
  | 'Draft'
  | 'Submitted'
  | 'Verified'
  | 'Processed'
  | 'Audited'

export interface Disbursement {
  id: string
  loanId: string
  disbursementDate: string
  status: DisbursementStatus
  applicantName: string
  bankName: string
  loanType: string
  sanctionedAmt: number
  disbursedAmt: number
  balancedAmt: number
  verifiedAmt: number | null
  referralPct: number
  creditExecutive: string
  bankLogo: string
}

export interface DisbursementStats {
  totalDisbursements: number
  totalDisbursedAmount: number
  submitted: number
  verified: number
  processed: number
  audited: number
}

export type ActivityType = 'created' | 'status' | 'amount'

export interface ActivityEntry {
  id: string
  type: ActivityType
  actor: string
  timestamp: string
  description: string
  from?: string
  to?: string
}

export interface Applicant {
  name: string
  type: 'Applicant' | 'Co-Applicant'
  email: string
  phone: string
  teamNumber: string
}

export interface DisbursementLineItem {
  id: string
  disbursementId: string
  date: string
  amount: number
  verifiedAmount: number | null
  utrNumber: string
  tranche: 'Full' | 'Partial'
  status: DisbursementStatus
}

export interface CommissionLineItem {
  id: string
  partyName: string
  subCodeCommissionPct: number
  grossCommissionPct: number
  commissionAmt: number
  invoiceNo: string
  invoiceStatus: 'Paid' | 'Pending'
}

export interface BrokerLineItem {
  id: string
  brokerName: string
  brokerCode: string
  brokerType: 'Aggregator' | 'Sub-connector'
  brokerCommissionPct: number
  referralFee: number
  poNumber: string
  poDate: string
  poStatus: 'Paid' | 'Pending'
}

export interface LoanDocument {
  id: string
  name: string
  sizeKb: number
}

export interface LoanDetail {
  loanId: string
  applicantName: string
  status: DisbursementStatus
  homeLoanLabel: string
  stage: string
  totalSanctionedAmount: number
  totalDisbursedAmount: number
  commissionIncome: number
  referralFee: number
  applicants: Applicant[]
  loanType: string
  bank: string
  sanctionDate: string
  loanSanctionedAmount: number
  verifiedSanctionedAmount: number
  bankExecutiveName: string
  creditExecutiveDetails: string
  source: string
  activity: ActivityEntry[]
  disbursements: DisbursementLineItem[]
  totalCommission: number
  commissionEntries: CommissionLineItem[]
  totalReferralFee: number
  brokerEntries: BrokerLineItem[]
  notes: string
  documents: LoanDocument[]
}

export type ColumnKey =
  | 'disbursementDate'
  | 'loanId'
  | 'applicantName'
  | 'bankName'
  | 'loanType'
  | 'sanctionedAmt'
  | 'disbursedAmt'
  | 'balancedAmt'
  | 'verifiedAmt'
  | 'referralPct'
  | 'creditExecutive'
  | 'bank'
  | 'status'
