import { useEffect, useState } from "react"
import { nexa, nexaIncome } from "./companies.js"
import { CtaButton } from "./Layout.jsx"

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const inputCls = "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base outline-none focus:border-indigo-600"

/** Income at a researched company. Uses published fees for brokers; otherwise the LO's own bps. */
function theirIncome(d, { volumeM, avgLoan, grossBps, currentBps }) {
  const published = d.kind === "broker" && (d.perFileFee != null || d.companyRetainBps != null)
  if (!published) return { value: volumeM * 1_000_000 * (currentBps / 10_000), basis: "your current comp" }
  const loans = avgLoan > 0 ? (volumeM * 1_000_000) / avgLoan : 0
  const netBps = Math.max(0, grossBps - (d.companyRetainBps ?? 0))
  const value = volumeM * 1_000_000 * (netBps / 10_000) - loans * (d.perFileFee ?? 0) - (d.monthlyFee ?? 0) * 12
  return { value, basis: "its published fees" }
}

/**
 * "Don't see your company?" — researches any mortgage company live via api/compare.
 * Renders nothing until the API reports it's enabled.
 */
export function AiCompare() {
  const [enabled, setEnabled] = useState(false)
  const [company, setCompany] = useState("")
  const [volume, setVolume] = useState("30")
  const [avgLoan, setAvgLoan] = useState("400000")
  const [currentBps, setCurrentBps] = useState("80")
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    fetch("/api/compare")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((j) => alive && setEnabled(Boolean(j.enabled)))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (!enabled) return null

  async function run(e) {
    e.preventDefault()
    setStatus("loading")
    setError("")
    setData(null)
    try {
      const r = await fetch("/api/compare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ company }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || "Something went wrong.")
      setData(j)
      setStatus("done")
      try {
        window.gtag?.("event", "ai_compare", { company: j.name || company, found: j.found })
      } catch {
        /* optional */
      }
    } catch (err) {
      setError(err.message)
      setStatus("error")
    }
  }

  const inputs = {
    volumeM: Math.max(0, Number(volume) || 0),
    avgLoan: Math.max(0, Number(avgLoan) || 0),
    currentBps: Math.max(0, Number(currentBps) || 0),
    grossBps: nexa.defaultGrossBps,
  }
  const facts = data
    ? [
        ["Type", { bank: "Bank", retail: "Retail lender", broker: "Broker", unknown: "Not clear" }[data.kind]],
        ["How LOs are paid", data.payModel || "Not published"],
        ["Company keeps", data.companyRetainBps != null ? `${data.companyRetainBps} bps per loan` : "Not published"],
        ["Per-file fee", data.perFileFee != null ? usd.format(data.perFileFee) : "Not published"],
        ["Monthly fee", data.monthlyFee != null ? usd.format(data.monthlyFee) : "Not published"],
        ["Leads", data.leadsProvided == null ? "Not stated" : data.leadsProvided ? "Company provides leads" : "LO generates their own"],
        ["Lenders", data.lenderAccess || "Not stated"],
        ["Licensing", data.licensing || "Not stated"],
      ]
    : []
  const theirs = data ? theirIncome(data, inputs) : null
  const ours = nexaIncome(inputs)

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Don't see your company?</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Compare any mortgage company with NEXA</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Type in where you work now. We'll research how it pays loan officers and line it up next to NEXA. It takes
          about 30 seconds.
        </p>

        <form onSubmit={run} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Your company</span>
            <input value={company} onChange={(e) => setCompany(e.target.value)} maxLength={80} required
              placeholder="e.g. Wells Fargo, Guild Mortgage, CrossCountry" className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Yearly volume ($M)</span>
            <input type="number" min="0" value={volume} onChange={(e) => setVolume(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Avg. loan size</span>
            <input type="number" min="0" value={avgLoan} onChange={(e) => setAvgLoan(e.target.value)} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Your comp now (bps)</span>
            <input type="number" min="0" value={currentBps} onChange={(e) => setCurrentBps(e.target.value)} className={inputCls} />
          </label>
          <button type="submit" disabled={status === "loading"}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:opacity-60">
            {status === "loading" ? "Researching…" : "Compare"}
          </button>
        </form>

        {status === "loading" && <p className="mt-6 text-sm text-slate-600" aria-live="polite">Looking up how they pay loan officers — hang tight…</p>}
        {status === "error" && <p className="mt-6 text-sm text-red-700" role="alert">{error}</p>}
        {status === "done" && data && !data.found && (
          <p className="mt-6 text-slate-700" aria-live="polite">
            We couldn't find published details for that company. That's common — the fastest way to compare is a quick
            conversation with Andres.
          </p>
        )}

        {status === "done" && data?.found && (
          <div className="mt-8" aria-live="polite">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-semibold">{data.name}</h3>
                <dl className="mt-4 flex flex-col gap-3">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{k}</dt>
                      <dd className="mt-0.5 text-slate-700">{v}</dd>
                    </div>
                  ))}
                </dl>
                {data.notes && <p className="mt-4 text-sm leading-6 text-slate-600">{data.notes}</p>}
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-semibold">Estimated yearly income</h3>
                <p className="mt-1 text-sm text-slate-500">${inputs.volumeM}M in ${Math.round(inputs.avgLoan / 1000)}K loans</p>
                <table className="mt-4 w-full text-left text-sm">
                  <tbody>
                    <tr className="border-t border-slate-100">
                      <th scope="row" className="py-2.5 font-medium">{data.name} <span className="font-normal text-slate-500">({theirs.basis})</span></th>
                      <td className="py-2.5 text-right tabular-nums">{usd.format(Math.max(0, theirs.value))}</td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <th scope="row" className="py-2.5 font-medium">NEXA — standard plan <span className="font-normal text-slate-500">({nexa.defaultGrossBps} bps gross)</span></th>
                      <td className="py-2.5 text-right tabular-nums">{usd.format(Math.max(0, ours))}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Before taxes, benefits, and business expenses. NEXA keeps {nexa.standardRetainBps} bps per loan on the
                  standard plan. Fees marked "Not published" aren't counted.
                </p>
                <div className="mt-5"><CtaButton cta="ai_compare_result">Talk Through It With Andres</CtaButton></div>
              </div>
            </div>
            {data.sources?.length > 0 && (
              <div className="mt-6 text-xs leading-6 text-slate-500">
                <p className="font-semibold text-slate-700">Sources</p>
                <ul className="list-disc pl-5">
                  {data.sources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer nofollow" className="underline underline-offset-2">{s.title}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 text-xs leading-5 text-slate-500">
              AI-generated estimate from publicly available sources, researched{" "}
              {new Date(data.researchedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}. It may be
              incomplete or out of date and isn't a statement by that company — confirm details directly. For mortgage
              professionals; not an offer to lend. NEXA is not affiliated with {data.name}.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
