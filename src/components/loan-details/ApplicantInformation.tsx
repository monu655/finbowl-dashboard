import type { Applicant } from '@/types/disbursement'

export function ApplicantInformation({ applicants }: { applicants: Applicant[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-secondary">
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Type</th>
            <th className="pb-2 font-medium">Email ID</th>
            <th className="pb-2 font-medium">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => (
            <tr key={a.email} className="border-b border-border last:border-0">
              <td className="py-3 text-text-primary">{a.name}</td>
              <td className="py-3">
                <span
                  className={
                    a.type === 'Applicant'
                      ? 'rounded-pill bg-status-verified-bg px-2 py-0.5 text-xs font-medium text-status-verified-fg'
                      : 'rounded-pill bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary'
                  }
                >
                  {a.type}
                </span>
              </td>
              <td className="py-3 text-text-secondary">{a.email}</td>
              <td className="py-3 text-text-secondary">{a.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
