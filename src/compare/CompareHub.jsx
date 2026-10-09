import { CompareLayout, CtaButton } from "./Layout.jsx"
import { ASOF, companyList, nexa, nexaFacts } from "./companies.js"
import { AiCompare } from "./AiCompare.jsx"

export function CompareHub() {
  return (
    <CompareLayout crumbs={[{ name: "Home", href: "/" }, { name: "Compare", href: "/compare" }]}>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">For loan officers · {ASOF}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Compare mortgage companies: where loan officers keep more
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Retail banks, high-volume lenders, and brokers all pay loan officers differently — and most don't publish
          it. Here's an honest look at NEXA next to the companies loan officers ask about most, with a calculator that
          uses your real numbers. Where another company comes out ahead on fees, we'll show you that too.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">At a glance</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Company</th>
                <th scope="col" className="px-4 py-3 font-semibold">Model</th>
                <th scope="col" className="px-4 py-3 font-semibold">What the LO pays or gives up</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 bg-indigo-50/60">
                <th scope="row" className="px-4 py-3 font-semibold">NEXA Lending</th>
                <td className="px-4 py-3">Broker plus NEXA's own lending</td>
                <td className="px-4 py-3">{nexa.standardRetainBps} bps per loan on the standard plan; NEXA100 program with conditions</td>
              </tr>
              {companyList.map((c) => (
                <tr key={c.slug} className="border-t border-slate-100">
                  <th scope="row" className="px-4 py-3 font-medium">
                    <a href={`/compare/${c.slug}`} className="underline-offset-4 hover:underline">{c.name}</a>
                  </th>
                  <td className="px-4 py-3">{c.model}</td>
                  <td className="px-4 py-3">
                    {c.kind === "broker" ? "$695 per file + $79/month" : "Pay set by the employer and not published"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Detailed comparisons</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {companyList.map((c) => (
            <a key={c.slug} href={`/compare/${c.slug}`} className="rounded-[1.5rem] border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-xl font-semibold">NEXA vs {c.name}</h3>
              <p className="mt-2 leading-7 text-slate-600">{c.model}.</p>
              <span className="mt-4 inline-block text-sm font-semibold text-indigo-700">See the full comparison →</span>
            </a>
          ))}
        </div>
      </section>

      <AiCompare />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">How NEXA works</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {nexaFacts.map(([k, v]) => (
            <div key={k} className="rounded-[1.5rem] border border-slate-200 p-6">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{k}</dt>
              <dd className="mt-1 leading-7 text-slate-700">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-700 to-indigo-600 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight">Not sure which model fits you?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">Bring your real numbers. Andres has made the move himself and will give you the honest version.</p>
          <div className="mt-8"><CtaButton cta="compare_hub_footer" light /></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 text-xs leading-6 text-slate-500 sm:px-6 lg:px-8">
        <p>
          Based on publicly available information as of {ASOF}; sources are listed on each comparison page. For mortgage
          professionals; not an offer to lend. NEXA is not affiliated with the other companies named, whose names are
          trademarks of their respective owners.
        </p>
      </section>
    </CompareLayout>
  )
}
