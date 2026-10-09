import { useState } from "react"
import { nexa, nexaIncome } from "./companies.js"

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

function Field({ label, value, onChange, prefix, suffix, hint }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-indigo-600">
        {prefix && <span className="text-slate-400">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 pl-1 text-base text-slate-900 outline-none"
        />
        {suffix && <span className="text-slate-400">{suffix}</span>}
      </span>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

/**
 * Yearly income comparison. For retail/bank pages the LO enters their own
 * current comp in bps (it isn't published). For broker pages (Barrett) both
 * sides use the same gross comp and subtract each company's fees.
 */
export function IncomeCalculator({ company }) {
  const isBroker = company.kind === "broker"
  const [volume, setVolume] = useState("30")
  const [avgLoan, setAvgLoan] = useState("400000")
  const [currentBps, setCurrentBps] = useState("80")
  const [grossBps, setGrossBps] = useState(String(nexa.defaultGrossBps))

  const v = Math.max(0, Number(volume) || 0)
  const loan = Math.max(0, Number(avgLoan) || 0)
  const gross = Math.max(0, Number(grossBps) || 0)
  const cur = Math.max(0, Number(currentBps) || 0)

  const nexaYear = nexaIncome({ volumeM: v, grossBps: gross })
  const theirs = isBroker
    ? company.income({ volumeM: v, grossBps: gross, avgLoan: loan })
    : v * 1_000_000 * (cur / 10_000)

  const nexaNetBps = Math.max(0, gross - nexa.standardRetainBps)
  const volumeToMatch = !isBroker && nexaNetBps > 0 ? theirs / (nexaNetBps / 10_000) / 1_000_000 : null

  const rows = [
    { name: isBroker ? company.name : `${company.name} (your current comp)`, value: theirs },
    { name: "NEXA — standard plan", value: nexaYear, nexa: true },
  ]
  const best = Math.max(...rows.map((r) => r.value))

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Yearly funded volume" value={volume} onChange={setVolume} prefix="$" suffix="M" />
        <Field label="Average loan size" value={avgLoan} onChange={setAvgLoan} prefix="$" />
        {!isBroker && (
          <Field
            label={`Your comp at ${company.short}`}
            value={currentBps}
            onChange={setCurrentBps}
            suffix="bps"
            hint="Replace with your real number — retail pay isn't published"
          />
        )}
        <Field
          label="Gross comp per loan at NEXA"
          value={grossBps}
          onChange={setGrossBps}
          suffix="bps"
          hint={`Before NEXA's ${nexa.standardRetainBps} bps on the standard plan`}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Where you work</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Estimated yearly income</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-slate-100">
                <th scope="row" className="px-4 py-3 font-medium">
                  {r.name}
                  {r.value === best && v > 0 && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Higher</span>
                  )}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{usd.format(Math.max(0, r.value))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {volumeToMatch != null && v > 0 && (
        <p className="mt-4 text-sm text-slate-700">
          To match your current income at NEXA, you'd need about{" "}
          <span className="font-semibold">${volumeToMatch.toFixed(1)}M</span> in yearly volume
          {volumeToMatch < v ? ` — about $${(v - volumeToMatch).toFixed(1)}M less than today.` : "."}
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Estimates for comparison only, before taxes, benefits, and business expenses. NEXA's standard plan keeps{" "}
        {nexa.standardRetainBps} bps per loan. Actual comp depends on the lender, loan, and pricing, and loan officer
        compensation must follow federal LO comp rules. {isBroker ? company.excludes : ""} Retail roles often include
        W-2 benefits that aren't reflected here.
      </p>
    </div>
  )
}
