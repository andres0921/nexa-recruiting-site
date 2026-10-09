import { CompareLayout, CtaButton } from "./Layout.jsx"
import { IncomeCalculator } from "./IncomeCalculator.jsx"
import { ASOF, nexaFacts, nexaSource, bankLicensingNote } from "./companies.js"
import { compareFaqs } from "./faqs.js"

function FactList({ title, facts, highlight = false }) {
  return (
    <div className={`rounded-[2rem] border p-6 sm:p-8 ${highlight ? "border-indigo-700 bg-gradient-to-br from-slate-950 to-indigo-800 text-white" : "border-slate-200 bg-white"}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <dl className="mt-5 flex flex-col gap-4">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt className={`text-xs font-semibold uppercase tracking-[0.15em] ${highlight ? "text-indigo-200" : "text-slate-500"}`}>{k}</dt>
            <dd className={`mt-1 leading-7 ${highlight ? "text-white" : "text-slate-700"}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function ComparePage({ company: c }) {
  const faqs = compareFaqs(c)
  return (
    <CompareLayout
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Compare", href: "/compare" },
        { name: `NEXA vs ${c.short}`, href: `/compare/${c.slug}` },
      ]}
    >
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">For loan officers · {ASOF}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          NEXA vs {c.name}: comp, control, and growth compared
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{c.pitch}</p>
        <div className="mt-8"><CtaButton cta={`compare_${c.slug}_hero`}>Run My Numbers With Andres</CtaButton></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Side by side</h2>
        <p className="mt-3 max-w-3xl text-slate-600">{c.name}: {c.model}.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <FactList title="NEXA Lending" facts={nexaFacts} highlight />
          <FactList title={c.name} facts={c.facts} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">What could you earn?</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Plug in your own production. {c.kind === "broker" ? `Uses ${c.short}'s published fees as of ${ASOF}.` : "Retail pay isn't published, so start with your real comp."}
        </p>
        <div className="mt-8"><IncomeCalculator company={c} /></div>
      </section>

      {c.kind === "bank" && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-indigo-200 bg-indigo-50 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Moving from a bank: licensing</h2>
            <p className="mt-3 leading-7 text-slate-700">{bankLicensingNote}</p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Common questions</h2>
        <dl className="mt-8 flex flex-col gap-6">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-[1.5rem] border border-slate-200 p-6">
              <dt className="text-lg font-semibold">{f.q}</dt>
              <dd className="mt-2 leading-7 text-slate-600">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-700 to-indigo-600 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight">Curious what your business could look like at NEXA?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
            Bring your real numbers. Andres will give you the honest version — even if the answer is to stay put.
          </p>
          <div className="mt-8"><CtaButton cta={`compare_${c.slug}_footer`} light /></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 text-xs leading-6 text-slate-500 sm:px-6 lg:px-8">
        <h2 className="text-sm font-semibold text-slate-700">Sources and notes</h2>
        <ul className="mt-2 list-disc pl-5">
          {[nexaSource, ...c.sources].map(([label, href]) => (
            <li key={href}><a href={href} target="_blank" rel="noreferrer nofollow" className="underline underline-offset-2">{label}</a></li>
          ))}
        </ul>
        <p className="mt-3">
          Based on publicly available information as of {ASOF}. Compensation and fees change and can vary by loan
          officer, branch, and state — confirm current terms directly before making a decision. This page is for
          mortgage professionals and is not an offer to lend. NEXA is not affiliated with {c.name}, whose name is a
          trademark of its respective owner.
        </p>
      </section>
    </CompareLayout>
  )
}
