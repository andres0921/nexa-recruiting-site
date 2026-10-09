export const CALENDLY_URL = "https://calendly.com/aaviles-nexalending/30min"

function track(cta) {
  try {
    if (window?.gtag) window.gtag("event", "cta_click", { cta })
    if (window?.dataLayer) window.dataLayer.push({ event: "cta_click", payload: { cta } })
  } catch {
    /* analytics is optional */
  }
}

export function CtaButton({ cta, children = "Book a 30-minute call", light = false }) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noreferrer"
      onClick={() => track(cta)}
      className={
        light
          ? "inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          : "inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-600"
      }
    >
      {children}
    </a>
  )
}

/** Shared shell for the comparison pages: header, breadcrumb, footer. */
export function CompareLayout({ crumbs = [], children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center">
            <img src="/NEXAMortgage.png" alt="NEXA Mortgage" className="h-10 w-auto object-contain" />
          </a>
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <a href="/" className="hidden transition hover:text-indigo-600 sm:inline">Why NEXA</a>
            <a href="/compare" className="transition hover:text-indigo-600">Compare</a>
            <CtaButton cta="compare_header">Talk to Andres</CtaButton>
          </nav>
        </div>
      </header>

      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-6 text-sm text-slate-500 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i < crumbs.length - 1 ? (
                  <a href={c.href} className="transition hover:text-slate-900">{c.name}</a>
                ) : (
                  <span className="text-slate-700">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main>{children}</main>

      <footer className="mt-20 border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <span>NEXA vs Retail — loan officer growth platform</span>
          <div className="flex flex-wrap gap-4">
            <a href="/" className="transition hover:text-slate-900">Why NEXA</a>
            <a href="/compare" className="transition hover:text-slate-900">Compare lenders</a>
            <a href="https://www.andresaviles.com" className="transition hover:text-slate-900">Andres Aviles · NMLS #2640511</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
