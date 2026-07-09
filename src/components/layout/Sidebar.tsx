import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui-store'

interface NavChild {
  label: string
  href: string
}

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  href?: string
  children?: NavChild[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/home' },
  { label: 'Finance', icon: Wallet, href: '/finance' },
  { label: 'Sales CRM', icon: Users, href: '/sales-crm' },
  {
    label: 'RMS',
    icon: FileText,
    children: [
      { label: 'Dashboard', href: '/rms/dashboard' },
      { label: 'Disbursement', href: '/disbursement' },
      { label: 'Invoices', href: '/rms/invoices' },
      { label: 'PO', href: '/rms/po' },
      { label: 'RMS Reports', href: '/rms/reports' },
    ],
  },
  { label: 'Compliance', icon: ShieldCheck, href: '/compliance' },
  { label: 'Vendors', icon: Truck, href: '/vendors' },
  { label: 'AI Suite', icon: Sparkles, href: '/ai-suite' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
]

function SidebarContent() {
  const location = useLocation()
  const [search, setSearch] = useState('')

  const activeParent = useMemo(() => {
    const withActiveChild = NAV_ITEMS.find((item) =>
      item.children?.some((c) => location.pathname.startsWith(c.href)),
    )
    return withActiveChild?.label ?? 'RMS'
  }, [location.pathname])

  const [expanded, setExpanded] = useState<string | null>(activeParent)

  useEffect(() => {
    setExpanded(activeParent)
  }, [activeParent])

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#2A1B54] via-[#241854] to-[#3B2A8C] text-white/80">
      <Link to="/home" className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-brand-purple">
          F
        </div>
        <span className="text-lg font-semibold text-white">FinBowl</span>
      </Link>

      <div className="px-3 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            aria-label="Search navigation"
            className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-8 pr-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
        {filteredItems.map((item) => {
          const isOpen = expanded === item.label
          const Icon = item.icon
          const isDirectActive = item.href && location.pathname === item.href
          return (
            <div key={item.label}>
              {item.children ? (
                <button
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                    isOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} />
                    {item.label}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform', isOpen && 'rotate-180')}
                  />
                </button>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                    isDirectActive
                      ? 'bg-white/10 text-white font-medium'
                      : 'hover:bg-white/5 hover:text-white',
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )}
              {item.children && isOpen && (
                <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                  {item.children.map((child) => {
                    const isActive = location.pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                          isActive ? 'text-white font-medium' : 'text-white/60 hover:text-white',
                        )}
                      >
                        <ChevronRight size={12} className="opacity-60" />
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-3 text-xs text-white/40">
        v.version 1.0
      </div>
    </div>
  )
}

export function Sidebar() {
  const isMobileOpen = useUiStore((s) => s.isMobileSidebarOpen)
  const setMobileOpen = useUiStore((s) => s.setMobileSidebarOpen)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block" aria-label="Primary navigation">
        <SidebarContent />
      </aside>

      {/* Mobile / tablet: off-canvas drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              aria-label="Primary navigation"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
                <SidebarContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
