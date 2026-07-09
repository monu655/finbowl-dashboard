export function AdditionalInformation({ notes }: { notes: string }) {
  return (
    <p className="rounded-md bg-surface-muted p-4 text-sm leading-relaxed text-text-secondary">
      {notes}
    </p>
  )
}
