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

The structure is feature-oriented: anything purely presentational lives in
`components/`, data-fetching and server-state logic lives in `features/`, and
route-level screens live in `pages/` and stay thin — they compose components and
wire up hooks, nothing else.

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
        ├── ApplicantInformation / LoanDetailsSection (accordion panels)
        └── ActivityLogDrawer     (Drawer)
```

## State Management Strategy

Three deliberately separate layers, so each kind of state lives where it's cheapest
to reason about:

1. **Server state — TanStack Query.** All data that originates from an API
   (`useDisbursements`, `useDisbursementStats`, `useLoanDetail`) is owned by React
   Query. It gives caching, request de-duplication, `isLoading` / `isError` /
   `refetch` out of the box, and a clean seam for swapping the mock `fetch*`
   functions in `features/disbursement/api.ts` for real HTTP calls later.
2. **Cross-component UI state — Zustand.** Things like the current search string,
   which table columns are visible, and whether the "Add Disbursement" modal or the
   Activity Log drawer is open need to be read/written from sibling components
   (e.g. the search input lives in the table toolbar, but the table itself consumes
   it). A small Zustand store (`store/table-store.ts`) avoids prop-drilling without
   pulling in a heavier state library.
3. **Local component state — `useState`.** Anything only relevant to one component
   (form submitting flag, active tab, row selection) stays local.

## Performance Optimizations

- **Memoized column defs & derived visibility map** (`useMemo`) in
  `DisbursementTable` so TanStack Table doesn't rebuild its column model on every
  render.
- **`getRowId`** is set explicitly so React Query cache updates and row-selection
  state stay stable across refetches instead of relying on array index.
- **Route-level code splitting** via `React.lazy` — `DashboardPage`,
  `LoanDetailsPage`, and `ModuleOverviewPage` load on demand instead of bloating
  the main bundle.
- **CSS-only animations where possible**, Framer Motion reserved for the places
  it earns its keep (modal, drawer, popover) rather than sprinkled everywhere.
- **`staleTime`** set on list queries so switching between dashboard and loan
  detail and back doesn't trigger a redundant network waterfall.
- **Virtualization-ready table markup** — the `<table>` structure is plain enough
  to drop in `@tanstack/react-virtual` later if the dataset grows past a few
  hundred rows; not added now since 10-row pagination makes it unnecessary today.

## Real-World States Handled

- **Loading:** skeleton rows in the table, skeleton blocks on the stats cards and
  loan detail header while the query is in flight.
- **Error:** a dedicated `ErrorState` with a Retry button wired to `refetch()` —
  shown on both the dashboard table and the loan detail page.
- **Empty:** distinguishes "no data at all" from "no rows match your search/filter"
  with different copy and an optional call-to-action.

## Responsive Behavior

- Sidebar collapses into an off-canvas drawer below the `lg` breakpoint, toggled
  from the topbar hamburger.
- Stats cards reflow from a 6-column grid down to 3 and then 2 columns.
- The data table scrolls horizontally on narrower viewports instead of squashing
  columns unreadably.
- Loan detail tabs turn into a horizontally scrollable rail on narrow screens
  instead of sitting in a fixed-width left column.

## Design Tokens

Colors, spacing, radii, and shadows are centralized in `tailwind.config.ts` (e.g.
`brand.purple`, `status.submitted`, `shadow.card`) rather than inlined as arbitrary
values, so a design change is a one-line edit instead of a find-and-replace across
components.

## Interactivity

Every element in the design is wired to real behavior — no dead links or
placeholder pages. State changes are held in TanStack Query's cache or Zustand, so
they persist for the session and reset on reload, same as any client-only demo.

- **Sidebar** — every item routes somewhere real. Disbursement is the fully-built
  flow; the surrounding modules (Finance, Sales CRM, RMS Dashboard/Invoices/PO/
  Reports, Compliance, Vendors, AI Suite, Reports, Settings) route to a shared
  `ModuleOverviewPage` with realistic mock stats and a clickable activity list —
  see `lib/module-content.ts` to extend any of them into a fully custom page.
- **Stat cards filter the table** — click Submitted/Verified/Processed/Audited to
  filter by that status; click again to clear.
- **Every table column has sort + filter.** Filter icons open a small text filter
  per column; active filters show as removable chips above the table.
- **Status is editable inline** everywhere it appears (table rows, loan detail
  header) via a click-to-open status popover, backed by a mutation.
- **Bulk select → delete** with a confirmation modal.
- **Add Disbursement** actually appends a new row to the table via a mutation
  (optimistic, in-memory).
- **Import Excel** opens a real file picker and simulates an import.
- **Export All** downloads a real CSV of the current dataset.
- **Saved View / Create Custom View** are both functional — apply a saved view, or
  save the current column configuration as a new one.
- **Notification bell** opens a real dropdown with unread counts and
  mark-as-read.
- **Profile avatar** opens a dropdown (profile / settings / log out).
- **Advisory group pills** are toggleable via a popover.
- **Loan Detail page** uses collapsible accordion sections with a left-hand tab
  rail that scrolls to and expands the relevant section; Archive and Edit Loan
  open real confirm/edit flows; Summary Tiles has a working show/hide toggle;
  Documents cards trigger a download toast.
- **Numbered pagination** with first/last controls on the main table.
- Every modal, drawer, and popover closes via backdrop click, Escape, or its
  close button.

**Scope note:** the non-Disbursement sidebar modules (Finance, Sales CRM,
Compliance, etc.) are intentionally built as one shared, functional page template
rather than eight fully bespoke module UIs — that depth of build (each with its
own data model, table, and detail views) is out of scope for this assignment.
Nothing 404s and every click does something meaningful, but if one of those
modules needs the same depth as Disbursement, `ModuleOverviewPage` +
`module-content.ts` is the starting point.

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