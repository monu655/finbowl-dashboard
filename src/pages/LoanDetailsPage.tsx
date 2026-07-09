import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileStack, Landmark, Notebook, UserRound, Users } from 'lucide-react'
import { AccordionSection } from '@/components/loan-details/AccordionSection'
import { ActivityLogDrawer } from '@/components/loan-details/ActivityLog'
import { AdditionalInformation } from '@/components/loan-details/AdditionalInformation'
import { ApplicantInformation } from '@/components/loan-details/ApplicantInformation'
import { BrokerInformation } from '@/components/loan-details/BrokerInformation'
import { Commission } from '@/components/loan-details/Commission'
import { DisbursementsInformation } from '@/components/loan-details/DisbursementsInformation'
import { Documents } from '@/components/loan-details/Documents'
import { LoanDetailsSection } from '@/components/loan-details/LoanDetailsSection'
import { LoanSummaryHeader } from '@/components/loan-details/LoanSummaryHeader'
import { LoanTabs, type TabDef } from '@/components/loan-details/LoanTabs'
import { ErrorState } from '@/components/ui/StateViews'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLoanDetail } from '@/features/disbursement/hooks'
import { formatCurrency } from '@/lib/utils'

const TABS: TabDef[] = [
  { key: 'applicant', label: 'Applicant Information' },
  { key: 'loan', label: 'Loan Details' },
  { key: 'disbursements', label: 'Disbursements Information' },
  { key: 'commission', label: 'Commission' },
  { key: 'broker', label: 'Broker Information' },
  { key: 'additional', label: 'Additional Information' },
]

export function LoanDetailsPage() {
  const { loanId = '' } = useParams()
  const { data: loan, isLoading, isError, refetch } = useLoanDetail(loanId)
  const [activeTab, setActiveTab] = useState('applicant')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const refs = {
    applicant: useRef<HTMLDivElement>(null),
    loan: useRef<HTMLDivElement>(null),
    disbursements: useRef<HTMLDivElement>(null),
    commission: useRef<HTMLDivElement>(null),
    broker: useRef<HTMLDivElement>(null),
    additional: useRef<HTMLDivElement>(null),
    documents: useRef<HTMLDivElement>(null),
  }

  function toggle(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleTabClick(key: string) {
    setActiveTab(key)
    setCollapsed((prev) => ({ ...prev, [key]: false }))
    requestAnimationFrame(() => {
      refs[key as keyof typeof refs]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 sm:py-6">
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && loan && (
        <>
          <LoanSummaryHeader loan={loan} />
          <div className="flex flex-col gap-5 lg:flex-row">
            <LoanTabs tabs={TABS} active={activeTab} onChange={handleTabClick} />
            <div className="min-w-0 flex-1 space-y-4">
              <AccordionSection
                ref={refs.applicant}
                title="Applicant Information"
                icon={<UserRound size={15} />}
                collapsed={Boolean(collapsed.applicant)}
                onToggle={() => toggle('applicant')}
              >
                <ApplicantInformation applicants={loan.applicants} />
              </AccordionSection>

              <AccordionSection
                ref={refs.loan}
                title="Loan Details"
                icon={<Landmark size={15} />}
                collapsed={Boolean(collapsed.loan)}
                onToggle={() => toggle('loan')}
              >
                <LoanDetailsSection loan={loan} />
              </AccordionSection>

              <AccordionSection
                ref={refs.disbursements}
                title="Disbursements Information"
                icon={<Users size={15} />}
                collapsed={Boolean(collapsed.disbursements)}
                onToggle={() => toggle('disbursements')}
              >
                <DisbursementsInformation items={loan.disbursements} />
              </AccordionSection>

              <AccordionSection
                ref={refs.commission}
                title="Commission"
                icon={<Users size={15} />}
                badge={
                  <span className="rounded-pill bg-status-submitted-bg px-2.5 py-0.5 text-xs font-medium text-status-submitted-fg">
                    Total Commission : {formatCurrency(loan.totalCommission)}
                  </span>
                }
                collapsed={Boolean(collapsed.commission)}
                onToggle={() => toggle('commission')}
              >
                <Commission entries={loan.commissionEntries} />
              </AccordionSection>

              <AccordionSection
                ref={refs.broker}
                title="Broker Information"
                icon={<Users size={15} />}
                badge={
                  <span className="rounded-pill bg-status-processed-bg px-2.5 py-0.5 text-xs font-medium text-status-processed-fg">
                    Total Referral Fee: {formatCurrency(loan.totalReferralFee)}
                  </span>
                }
                collapsed={Boolean(collapsed.broker)}
                onToggle={() => toggle('broker')}
              >
                <BrokerInformation entries={loan.brokerEntries} />
              </AccordionSection>

              <AccordionSection
                ref={refs.additional}
                title="Notes / Additional Information"
                icon={<Notebook size={15} />}
                collapsed={Boolean(collapsed.additional)}
                onToggle={() => toggle('additional')}
              >
                <AdditionalInformation notes={loan.notes} />
              </AccordionSection>

              <AccordionSection
                ref={refs.documents}
                title="Documents"
                icon={<FileStack size={15} />}
                collapsed={Boolean(collapsed.documents)}
                onToggle={() => toggle('documents')}
              >
                <Documents documents={loan.documents} />
              </AccordionSection>
            </div>
          </div>
          <ActivityLogDrawer activity={loan.activity} />
        </>
      )}
    </div>
  )
}
