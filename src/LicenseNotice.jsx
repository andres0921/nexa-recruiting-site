/** Licensing and Equal Housing disclosures shown in every footer. */
export default function LicenseNotice({ className = "" }) {
  return (
    <div className={`mx-auto flex max-w-7xl items-start gap-4 px-6 pb-6 text-xs leading-5 text-slate-500 lg:px-8 ${className}`}>
      <img src="/equal-housing-lender.png" alt="Equal Housing Lender" width="40" height="40" className="mt-0.5 h-10 w-10 shrink-0" />
      <div>
        <p>
          Andres Aviles, Loan Officer, NMLS #2640511. NEXA Lending, LLC, NMLS #1660690. Equal Housing Lender.
        </p>
        <p className="mt-1">
          <a href="https://www.nmlsconsumeraccess.org/" target="_blank" rel="noreferrer" className="underline hover:text-slate-900">
            NMLS Consumer Access
          </a>
        </p>
      </div>
    </div>
  )
}
