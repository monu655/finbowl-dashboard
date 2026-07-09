import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Skeleton } from '@/components/ui/Skeleton'

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const LoanDetailsPage = lazy(() =>
  import('@/pages/LoanDetailsPage').then((m) => ({ default: m.LoanDetailsPage })),
)
const ModuleOverviewPage = lazy(() =>
  import('@/pages/ModuleOverviewPage').then((m) => ({ default: m.ModuleOverviewPage })),
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function RouteFallback() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-6 sm:px-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/disbursement" replace />} />
              <Route path="/home" element={<ModuleOverviewPage moduleKey="home" />} />
              <Route path="/finance" element={<ModuleOverviewPage moduleKey="finance" />} />
              <Route path="/sales-crm" element={<ModuleOverviewPage moduleKey="sales-crm" />} />
              <Route
                path="/rms/dashboard"
                element={<ModuleOverviewPage moduleKey="rms-dashboard" />}
              />
              <Route path="/disbursement" element={<DashboardPage />} />
              <Route path="/rms/invoices" element={<ModuleOverviewPage moduleKey="invoices" />} />
              <Route path="/rms/po" element={<ModuleOverviewPage moduleKey="po" />} />
              <Route path="/rms/reports" element={<ModuleOverviewPage moduleKey="rms-reports" />} />
              <Route path="/compliance" element={<ModuleOverviewPage moduleKey="compliance" />} />
              <Route path="/vendors" element={<ModuleOverviewPage moduleKey="vendors" />} />
              <Route path="/ai-suite" element={<ModuleOverviewPage moduleKey="ai-suite" />} />
              <Route path="/reports" element={<ModuleOverviewPage moduleKey="reports" />} />
              <Route path="/settings" element={<ModuleOverviewPage moduleKey="settings" />} />
              <Route path="/loans/:loanId" element={<LoanDetailsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/disbursement" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
