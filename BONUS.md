# Bonus — Connecting the Dashboard to a Live API

The screen in Task 1 is already wired for this: `features/disbursement/api.ts` is
the single seam between the UI and data. Swapping mocks for a real backend means
replacing the bodies of `fetchDisbursements` / `fetchDisbursementStats` /
`fetchLoanDetail` with real `fetch` calls — nothing in the components changes,
since they only ever talk to the `useDisbursements` / `useLoanDetail` React Query
hooks.

```ts
export async function fetchDisbursements(): Promise<Disbursement[]> {
  const res = await fetch('/api/v1/disbursements')
  if (!res.ok) throw new Error(`Failed to load disbursements (${res.status})`)
  return res.json()
}
```

- **Loading state:** React Query's `isLoading` flag (true on the first fetch, no
  cached data yet) drives the skeleton rows already built into
  `DisbursementTable` — no extra state needed.
- **Error / failed request:** a thrown error inside the query function flips
  `isError` to true, which the components already read to render `ErrorState`
  with a **Retry** button bound to `refetch()`. I'd add exponential backoff via
  `retry: (failureCount, error) => failureCount < 3 && error.status !== 404` for
  transient network errors, while surfacing 4xx errors immediately.
- **Refreshing data:** `staleTime` controls how long cached data is considered
  fresh before a background refetch; for a live disbursement feed I'd pair that
  with either a manual refresh button that calls `queryClient.invalidateQueries()`,
  or `refetchInterval: 30_000` for near-real-time polling, and layer in optimistic
  updates via `useMutation` for the "Add Disbursement" form so the new row appears
  instantly while the request is in flight.
