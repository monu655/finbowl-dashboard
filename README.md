# FinBowl — Disbursement RMS Dashboard

A pixel-accurate, production-ready React implementation of the FinBowl Disbursement
dashboard and Loan Details screens, built for the Gracia Global Advisory take-home
assignment.

## Tech Stack

| Concern | Choice |
|---|---|
| Build tool | Vite 5 |
| Framework | React 19 (function components + hooks only) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS (design tokens in `tailwind.config.ts`) |
| Routing | React Router v6 |
| Server state | TanStack Query (loading / error / refetch handling) |
| Table | TanStack Table v8 (sorting, filtering, pagination, column visibility) |
| Client state | Zustand (table UI state: search, column visibility, modals, drawer) |
| Icons | Lucide React |
| Motion | Framer Motion (modal, drawer, popover transitions) |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build       # type-check + production build to /dist
npm run preview      # preview the production build locally
npm run lint         # eslint
```

## Folder Structure

```
src/
├── components/
│   ├── ui/              # Design-system primitives: Button, Card, Input, Modal,
│   │                     # Drawer, Popover, Checkbox, StatusBadge, Skeleton,
│   │                     # EmptyState / ErrorState
│   ├── layout/           # AppShell, Sidebar, Topbar
│   ├── dashboard/         # StatsCards, DisbursementTable, ColumnVisibilityMenu,
│   │                     # AddDisbursementModal
│   └── loan-details/     # LoanSummaryHeader, LoanTabs, ApplicantInformation,
│                         # LoanDetailsSection, ActivityLog (drawer)
├── features/
│   └── disbursement/     # api.ts (data layer) + hooks.ts (React Query hooks)
├── pages/                 # DashboardPage, LoanDetailsPage — route-level composition
├── store/                 # Zustand stores (table UI state)
├── lib/                   # utils.ts (formatting, cn, status styles), mock-data.ts
├── types/                 # Shared TypeScript domain types
├── App.tsx                # Router + QueryClientProvider
└── main.tsx                # Entry point
```

The structure is feature-oriented: anything that's purely presentational lives in
`components/`, data-fetching and server-state logic lives in `features/`, and
route-level screens live in `pages/` and stay thin — they compose components and wire
up hooks, nothing else.

## Component Hierarchy

```
App
└── AppShell (Sidebar + Topbar + <Outlet/>)
    ├── DashboardPage
    │   ├── StatsCards            (useDisbursementStats)
    │   ├── DisbursementTable     (useDisbursements, TanStack Table)
    │   │   ├── ColumnVisibilityMenu (Popover + Checkbox list)
    │   │   └── EmptyState / ErrorState / Skeleton rows
    │   └── AddDisbursementModal  (Modal)
    └── LoanDetailsPage
        ├── LoanSummaryHeader     (useLoanDetail)
        ├── LoanTabs
        ├── ApplicantInformation / LoanDetailsSection (tab panels)
        └── ActivityLogDrawer     (Drawer)
```

## State Management Strategy

Three deliberately separate layers, so each kind of state lives where it's cheapest
to reason about:

1. **Server state — TanStack Query.** All data that originates from an API
   (`useDisbursements`, `useDisbursementStats`, `useLoanDetail`) is owned by React
   Query. It gives us caching, request de-duplication, `isLoading` / `isError` /
   `refetch` out of the box, and a clean seam for swapping the mock `fetch*`
   functions in `features/disbursement/api.ts` for real HTTP calls later.
2. **Cross-component UI state — Zustand.** Things like the current search string,
   which table columns are visible, and whether the "Add Disbursement" modal or the
   Activity Log drawer is open need to be read/written from sibling components
   (e.g. the search input lives in the table toolbar, but the table itself consumes
   it). A small Zustand store (`store/table-store.ts`) avoids prop-drilling without
   pulling in a heavier state library.
3. **Local component state — `useState`.** Anything that's only relevant to one
   component (form submitting flag, active tab, row selection) stays local.

## Performance Optimizations

- **Memoized column defs & derived visibility map** (`useMemo`) in
  `DisbursementTable` so TanStack Table doesn't rebuild its column model on every
  render.
- **`getRowId`** is set explicitly so React Query cache updates and row-selection
  state stay stable across refetches instead of relying on array index.
- **Code-splitting ready:** routes are already separated into `pages/`, so adding
  `React.lazy` per route is a non-breaking follow-up if the bundle grows.
- **CSS-only animations where possible**, Framer Motion reserved for the three
  places it earns its keep (modal, drawer, popover) rather than sprinkled
  everywhere.
- **`staleTime`** set on list queries so switching between dashboard and loan detail
  and back doesn't trigger a redundant network waterfall.
- **Virtualization-ready table markup** — the `<table>` structure is plain enough
  to drop in `@tanstack/react-virtual` later if the dataset grows past a few hundred
  rows; not added now since 10-row pagination makes it unnecessary today.

## Real-World States Handled

- **Loading:** skeleton rows in the table, skeleton blocks on the stats cards and
  loan detail header while the query is in flight.
- **Error:** a dedicated `ErrorState` with a Retry button wired to
  `refetch()` — shown on both the dashboard table and the loan detail page.
- **Empty:** distinguishes "no data at all" from "no rows match your search/filter"
  with different copy and an optional call-to-action.

## Responsive Behavior

- Sidebar collapses off-canvas below the `lg` breakpoint (left intentionally as a
  documented follow-up: this take-home focuses on the primary desktop/laptop layout
  called out in the brief — "holds up on a smaller laptop screen").
- Stats cards reflow from a 6-column grid down to 3 and then 2 columns.
- The data table scrolls horizontally on narrower viewports instead of squashing
  columns unreadably.
- Loan detail tabs stack above content on narrow screens instead of sitting in a
  fixed-width left rail.

## Design Tokens

Colors, spacing, radii, and shadows are centralized in `tailwind.config.ts` (e.g.
`brand.purple`, `status.submitted`, `shadow.card`) rather than inlined as arbitrary
values, so a design change is a one-line edit instead of a find-and-replace across
components.

## Full Interactivity Pass

Beyond the core Task 1 screens, every element in the design is wired to real
behavior (state changes are held in TanStack Query's cache or Zustand, so
they persist for the session and reset on reload, same as any client-only
demo):

- **Every sidebar item routes somewhere real.** Disbursement is the fully-built
  flow; the other modules (Finance, Sales CRM, RMS Dashboard/Invoices/PO/Reports,
  Compliance, Vendors, AI Suite, Reports, Settings) route to a shared
  `ModuleOverviewPage` with realistic stats and a clickable activity list, so
  there are no dead links — see `lib/module-content.ts` to extend any of them
  into a fully custom page later.
- **Stat cards filter the table** — click Submitted/Verified/Processed/Audited
  to filter the table by that status; click again to clear.
- **Every table column has sort + filter.** Filter icons open a small text
  filter per column; active filters show as removable chips above the table.
- **Status is editable inline** everywhere it appears (table rows, loan detail
  header) via a click-to-open status popover, backed by a mutation.
- **Bulk select → delete** with a confirmation modal.
- **Add Disbursement** actually appends a new row to the table via a mutation
  (optimistic, in-memory).
- **Import Excel** opens a real file picker and simulates an import.
- **Export All** downloads a real CSV of the current dataset.
- **Saved View / Create Custom View** are both functional — apply a saved
  view, or save your current column configuration as a new one.
- **Notification bell** opens a real dropdown with unread counts and
  mark-as-read.
- **Profile avatar** opens a dropdown (profile / settings / log out).
- **Advisory group pills** are toggleable via a popover.
- **Loan Detail page** uses collapsible accordion sections (matching the
  latest design) with a left-hand tab rail that scrolls to and expands the
  relevant section; Archive and Edit Loan open real confirm/edit flows;
  Summary Tiles has a working show/hide toggle; Documents cards trigger a
  download toast.
- **Numbered pagination** with first/last controls on the main table.
- Every modal, drawer, and popover closes via backdrop click, Escape, or its
  close button, and traps focus visually.

### Honest scope note

The non-Disbursement sidebar modules (Finance, Sales CRM, Compliance, etc.)
are intentionally built as one shared, real, functional page template rather
than eight fully bespoke module UIs — that depth of build (each with its own
data model, table, and detail views) is genuinely out of scope for a take-home
assignment. Nothing 404s and every click does something meaningful, but if
you want one of those modules built out to the same depth as Disbursement,
treat `ModuleOverviewPage` + `module-content.ts` as the starting point.

## Interactivity Coverage

Beyond the core Task 1 screen, every navigable element in the app resolves to real,
working behavior — no dead links or placeholder pages:

- **Sidebar** — every item (Dashboard, Finance, Sales CRM, RMS ▸ Dashboard/Disbursement/Invoices/PO/Reports,
  Compliance, Vendors, AI Suite, Reports) routes to a real page. The Disbursement
  screen is fully built to spec; the surrounding modules (Finance, Sales CRM,
  Compliance, Vendors, AI Suite, company-wide Reports) are rendered by a shared
  `ModuleOverviewPage` with realistic mock stats and a clickable activity list —
  intentionally lighter than Disbursement since they're outside this take-home's
  scope, but functional rather than stubbed.
- **Table** — sortable + per-column filterable headers, instant global search,
  numbered pagination, row selection with bulk delete (confirm modal), inline
  status editing (click any status badge), CSV export, and stat cards that filter
  the table by status when clicked.
- **Add Disbursement** — a real form wired to a mutation that prepends the new row
  to the table (via React Query cache update) and confirms with a toast.
- **Import Excel** — file picker with drag-to-click upload flow and a simulated
  import confirmation.
- **Saved View / Create Custom View** — select a saved view or name and save the
  current column configuration as a new one.
- **Notifications & Profile** — bell icon opens a real notification panel
  (click to mark read, "mark all read"); avatar opens a profile menu (view
  profile, settings, log out).
- **Advisory group switcher** — toggle each group in/out of view from the topbar.
- **Loan Details** — redesigned to match the accordion-card layout: collapsible
  sections (Applicant Information, Loan Details, Disbursements, Commission,
  Broker Information, Notes, Documents), a left tab rail that scrolls to and
  expands the matching section, a Summary Tiles toggle, an editable status badge,
  and working Archive / Activity Logs / Edit Loan actions (Edit Loan opens a
  prefilled form that patches the loan in place; Archive asks for confirmation).
- **Global feedback layer** — a toast system (`store/toast-store.ts` +
  `components/ui/Toaster.tsx`) confirms every mutation-style action (status
  change, delete, import, archive, edit) so nothing feels like a dead click.
- **Responsive** — off-canvas sidebar drawer below `lg`, horizontally scrollable
  table and tab rail on mobile, stacked toolbar and stat grids down to phone
  widths.




## Bonus — Connecting to a Live API

See the write-up in [`BONUS.md`](./BONUS.md).

## Deployment

The app is a static Vite build, so it deploys to any static host:

**Vercel**
```bash
npm i -g vercel
vercel --prod
```

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

Build command: `npm run build` · Output directory: `dist`

## AI Tool Usage Disclosure

This implementation was built with Claude (Anthropic) assisting on component
scaffolding, TypeScript types, and Tailwind styling based on the provided design
screenshots. All code was reviewed, type-checked (`tsc -b`), and verified with a
production build (`vite build`) before delivery.
