import { useMemo, useState } from "react"
import {
  ArrowRight,
  Briefcase,
  Calculator,
  ChevronDown,
  Clock3,
  Menu,
  TrendingUp,
  X,
} from "lucide-react"

const NAV_LINKS = [
  ["#why-nexa", "Why NEXA"],
  ["#comparison", "Compare"],
  ["#calculator", "Calculator"],
  ["#faq", "FAQ"],
]

const HERO_FEATURES = [
  [Calculator, "Educate", "Understand the model"],
  [Briefcase, "Recruit", "Attract aligned LOs"],
  [TrendingUp, "Grow", "Scale your production"],
]

const HERO_REASONS = [
  ["Ownership mindset", "Run your business like a business"],
  ["Better scalability", "Grow production without traditional caps"],
  ["Modern platform", "Systems and flexibility built for originators"],
]

const WHY_NEXA_CARDS = [
  [
    "Education",
    "Understand the NEXA structure, compensation philosophy, and operational model before making any decisions.",
  ],
  [
    "Opportunity",
    "See why experienced originators explore NEXA when they want more ownership and flexibility.",
  ],
  [
    "Growth",
    "Explore how the right platform can support production growth, team building, and long-term scalability.",
  ],
]

const IDEAL_LO_POINTS = [
  "Producing loan officers doing consistent volume",
  "Originators who want more control over their business",
  "Team builders who want room to scale",
  "Mortgage professionals exploring better economics",
]

const RETAIL_MODEL_POINTS = [
  "Lower compensation splits",
  "Corporate branding over personal brand",
  "Limited control over margins",
  "Production caps or tiered structures",
  "Company controls many business decisions",
]

const NEXA_MODEL_POINTS = [
  "Compensation structure designed for higher margins",
  "Ability to grow your personal brand",
  "Greater transparency into pricing and economics",
  "No traditional retail production caps",
  "Built for entrepreneurial loan officers",
]

const FAQ_ITEMS = [
  {
    q: "How does compensation work at NEXA?",
    a: "NEXA uses a structure designed to give producing loan officers significantly more transparency and control over their margins compared to many traditional retail models.",
  },
  {
    q: "What support systems are available?",
    a: "Loan officers have access to processing support, technology systems, training resources, and a national network of experienced originators.",
  },
  {
    q: "Is the transition difficult?",
    a: "Most loan officers find the transition much simpler than expected when the process is planned correctly. We walk through timelines, licensing, and setup during the initial conversations.",
  },
  {
    q: "Can I build my own brand?",
    a: "Yes. Many originators leverage NEXA as the operational backbone while continuing to grow their personal brand and referral network.",
  },
]

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const clampNumber = (value, fallback = "") => {
  if (value === "") return ""
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(parsed, 0)
}

const hasCalculatorInputs = (retailVolume, retailBps, nexaBps) => {
  return retailVolume !== "" && retailBps !== "" && nexaBps !== ""
}

function StatCard({ label, value, accent = false, full = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-indigo-100 bg-indigo-50" : "border-slate-200 bg-slate-50"
      } ${full ? "sm:col-span-2" : ""}`}
    >
      <div className={`text-sm ${accent ? "text-indigo-700" : "text-slate-500"}`}>{label}</div>
      <div className={`mt-2 text-3xl font-semibold ${accent ? "text-indigo-700" : "text-slate-950"}`}>
        {value}
      </div>
    </div>
  )
}

function NumberInput({ label, value, setValue, step = 1, helper, prefix, icon }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {icon ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              {icon}
            </span>
          ) : null}
          <span>{label}</span>
        </div>
        {prefix ? <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{prefix}</span> : null}
      </div>
      <input
        type="number"
        min="0"
        step={step}
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(clampNumber(e.target.value))}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        placeholder="Enter value"
      />
      {helper ? <div className="mt-2 pl-9 text-xs text-slate-500">{helper}</div> : null}
    </label>
  )
}

function InsightCard({ eyebrow, title, copy, dark = false }) {
  return (
    <div className={`rounded-2xl p-6 ${dark ? "bg-slate-900 text-white" : "bg-indigo-600 text-white"}`}>
      <div className={`text-sm uppercase tracking-[0.2em] ${dark ? "text-slate-300" : "text-indigo-200"}`}>
        {eyebrow}
      </div>
      <div className="mt-2 text-3xl font-semibold">{title}</div>
      <p className={`mt-2 leading-7 ${dark ? "text-slate-300" : "text-indigo-100"}`}>{copy}</p>
    </div>
  )
}

export default function NEXARecruitingSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [retailVolume, setRetailVolume] = useState("")
  const [retailBps, setRetailBps] = useState("")
  const [nexaBps, setNexaBps] = useState("")
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formCompany, setFormCompany] = useState("")
  const [formGoals, setFormGoals] = useState("")

  const calculatorReady = hasCalculatorInputs(retailVolume, retailBps, nexaBps)

  const calculator = useMemo(() => {
    if (!calculatorReady) return null

    const retailIncome = retailVolume * 1_000_000 * (retailBps / 10_000)
    const equivalentNexaVolume = nexaBps > 0 ? retailIncome / (nexaBps / 10_000) / 1_000_000 : 0
    const volumeReduction = Math.max(retailVolume - equivalentNexaVolume, 0)
    const avgLoanSize = 400_000
    const loanReduction = Math.max((volumeReduction * 1_000_000) / avgLoanSize, 0)
    const weeklyHoursBack = Math.max((retailVolume - equivalentNexaVolume) * 2, 0)
    const yearlyHoursBack = weeklyHoursBack * 48

    return {
      retailIncome,
      equivalentNexaVolume,
      volumeReduction,
      loanReduction,
      weeklyHoursBack,
      yearlyHoursBack,
    }
  }, [calculatorReady, retailVolume, retailBps, nexaBps])

  const formatCurrency = (value) => USD_FORMATTER.format(value)
  const formatMillions = (value) => `${value.toFixed(1)}M`

  const calendlyUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (formName.trim()) params.set("name", formName.trim())
    if (formEmail.trim()) params.set("email", formEmail.trim())
    if (formCompany.trim()) params.set("a1", formCompany.trim())
    if (formGoals.trim()) params.set("a2", formGoals.trim())

    const query = params.toString()
    return `https://calendly.com/aaviles-nexalending/30min${query ? `?${query}` : ""}`
  }, [formName, formEmail, formCompany, formGoals])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <a
        href="https://loanofficersupport.com/r/Andres27520"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-indigo-600"
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
        Switch Now
        <ArrowRight className="h-4 w-4" />
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <a href="#top" className="flex items-end gap-4">
            <img
              src="/NEXAMortgage.png"
              alt="NEXA Mortgage"
              className="h-14 w-auto object-contain lg:h-[4.5rem]"
            />
            <div className="flex flex-col justify-end pb-1 leading-none">
              <span className="text-xs text-slate-500">Loan Officer Growth Platform</span>
            </div>
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-slate-600 transition duration-200 hover:text-indigo-600"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              Book a Call
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </a>
              ))}
              <a
                href="#apply"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      <section
        id="top"
        style={{ scrollMarginTop: "7rem" }}
        className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(to_bottom_right,_#eef2ff,_#ffffff,_#eff6ff)]"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
              NEXA Lending Opportunity
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              The platform serious loan officers move to when they want more control.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              If you're a producing loan officer exploring what your next level could look like, NEXA Lending offers a model designed for autonomy, scalability, and stronger economics.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#apply"
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Schedule a Private Conversation
              </a>
              <a
                href="#why-nexa"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm"
              >
                Learn How The Model Works
              </a>
            </div>

            <div className="mt-10 grid max-w-xl gap-4 text-sm text-slate-600 sm:grid-cols-3">
              {HERO_FEATURES.map(([Icon, title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-semibold text-slate-950">{title}</div>
                  <div className="mt-1">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 text-white">
                <div className="text-sm uppercase tracking-[0.2em] text-indigo-200">Why Loan Officers Move To NEXA</div>
                <div className="mt-4 space-y-4">
                  {HERO_REASONS.map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white/10 p-4">
                      <div className="text-sm text-indigo-100">{label}</div>
                      <div className="mt-1 text-xl font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <div className="text-sm text-slate-500">Typical journey</div>
              <div className="mt-1 font-semibold text-slate-900">Curious → Educated → Strategic move</div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-nexa" style={{ scrollMarginTop: "7rem" }} className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Why experienced loan officers explore NEXA</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            This isn't about switching companies. It's about upgrading your platform.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Most producing loan officers eventually ask the same questions: Could my margins be better? Could my business be more scalable? Could I operate with more autonomy? This site exists to walk through those answers clearly and transparently.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {WHY_NEXA_CARDS.map(([title, text]) => (
            <div key={title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ideal-lo" style={{ scrollMarginTop: "7rem" }} className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Who fits best here</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">Loan officers who think like entrepreneurs</h3>
              <ul className="mt-6 space-y-4 text-slate-600">
                {IDEAL_LO_POINTS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Mindset shift</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">You're not just joining a brokerage. You're building your platform.</h3>
              <p className="mt-6 leading-7 text-slate-600">
                The most successful originators treat their mortgage business like a real company. NEXA is designed for that type of professional — someone who wants freedom, scalability, and a long-term growth platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="comparison" style={{ scrollMarginTop: "7rem" }} className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Model comparison</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Traditional retail model vs the NEXA model</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Many loan officers start in traditional retail environments. Over time, experienced originators begin exploring models that offer more flexibility, transparency, and scalability.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-stretch">
          <div className="h-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950">Traditional Retail Model</h3>
            <ul className="mt-6 space-y-3 text-slate-600">
              {RETAIL_MODEL_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-slate-400">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-full overflow-hidden rounded-[2rem] border-2 border-indigo-500 bg-white p-8 shadow-md">
            <div className="absolute right-4 top-4 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Preferred</div>
            <h3 className="text-xl font-semibold text-indigo-700">NEXA Model</h3>
            <ul className="mt-6 space-y-3 text-slate-600">
              {NEXA_MODEL_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Income illustration</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Potential to earn the same income with less volume</h2>
          <p className="mt-5 text-lg text-slate-600">
            Many producing loan officers discover that the economics of the NEXA model can allow them to generate similar or greater income while closing fewer loans — which can mean fewer hours, less stress, and more control over their schedule.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-stretch">
          <div className="h-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Typical Retail Scenario</h3>
            <div className="mt-6 space-y-3 text-slate-600">
              <p>Annual Production: <span className="font-semibold">$30M</span></p>
              <p>Average Comp: <span className="font-semibold">~100 bps</span></p>
              <p>Estimated Income: <span className="font-semibold">$300,000</span></p>
            </div>
            <div className="mt-6 text-sm text-slate-500">Many retail environments require higher production volume to reach top income levels.</div>
          </div>

          <div className="relative h-full overflow-hidden rounded-[2rem] border-2 border-indigo-500 bg-white p-8 shadow-md">
            <div className="absolute right-4 top-4 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Illustration</div>
            <h3 className="text-xl font-semibold text-indigo-700">Example NEXA Scenario</h3>
            <div className="mt-6 space-y-3 text-slate-600">
              <p>Annual Production: <span className="font-semibold">$20M</span></p>
              <p>Average Comp: <span className="font-semibold">~150 bps</span></p>
              <p>Estimated Income: <span className="font-semibold">$300,000</span></p>
            </div>
            <div className="mt-6 text-sm font-medium text-indigo-600">Similar income potential with lower volume can translate to fewer working hours and a more scalable business.</div>
          </div>
        </div>
      </section>

      <section id="calculator" style={{ scrollMarginTop: "7rem" }} className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 shadow-sm">
              <Clock3 className="h-4 w-4" />
              Interactive calculator
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              See how much time you may get back while earning the same income
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Start with your current volume and compensation, then compare it to a hypothetical NEXA comp scenario. The calculator is organized to answer three questions in order: what you make now, what volume you may need at NEXA, and how much time and file load that difference may give back.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-stretch">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:rounded-r-[1.1rem]">
                <div className="rounded-[1.2rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">Step 1</div>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">Enter your numbers</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Start with rough production and comp assumptions to unlock the comparison.
                      </p>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${calculatorReady ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {calculatorReady ? "Ready" : "3 inputs"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  <NumberInput
                    label="Current annual retail production"
                    value={retailVolume}
                    setValue={setRetailVolume}
                    helper="Example: 30 means $30M in annual production."
                    prefix="Millions"
                    icon="1"
                  />
                  <NumberInput
                    label="Current retail compensation"
                    value={retailBps}
                    setValue={setRetailBps}
                    step={5}
                    helper="Example: 100 bps = 1.00% comp."
                    prefix="BPS"
                    icon="2"
                  />
                  <NumberInput
                    label="Estimated NEXA compensation"
                    value={nexaBps}
                    setValue={setNexaBps}
                    step={5}
                    helper="Use your best estimate for a same-income comparison."
                    prefix="BPS"
                    icon="3"
                  />
                </div>
              </div>

              <div className="rounded-[1.75rem] border-2 border-indigo-500 bg-white p-6 shadow-xl xl:p-8 lg:rounded-l-[1.1rem]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Step 2</div>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">Same-income snapshot</h3>
                  </div>
                  <div className={`rounded-full px-4 py-2 text-sm font-medium ${calculatorReady ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                    {calculatorReady ? "Built for quick recruiting conversations" : "Complete Step 1 to reveal results"}
                  </div>
                </div>

                <div className="relative mt-6">
                  <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-4 transition ${calculatorReady ? "opacity-100" : "opacity-30 blur-[2px]"}`}>
                    <StatCard label="Current estimated income" value={calculatorReady ? formatCurrency(calculator.retailIncome) : "—"} />
                    <StatCard label="Volume needed at NEXA" value={calculatorReady ? formatMillions(calculator.equivalentNexaVolume) : "—"} accent />
                    <StatCard label="Annual volume reduction" value={calculatorReady ? formatMillions(calculator.volumeReduction) : "—"} />
                    <StatCard label="Time back" value={calculatorReady ? `${calculator.weeklyHoursBack.toFixed(1)} hrs/wk` : "—"} accent />
                  </div>

                  {!calculatorReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-xl bg-white/90 px-6 py-3 text-sm font-medium text-slate-700 shadow">
                        Enter your numbers to reveal the comparison
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {calculatorReady && (
              <div className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm xl:p-8 lg:rounded-t-[1.1rem]">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Step 3</div>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">What the reduction can feel like</h3>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <StatCard
                        label="Estimated loan files reduction"
                        value={`${calculator.loanReduction.toFixed(0)} fewer loans / year`}
                        accent
                        full
                      />
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 sm:col-span-2">
                        <div className="text-sm text-indigo-700">Monthly perspective</div>
                        <div className="mt-1 text-lg font-semibold text-indigo-700">
                          ≈ {(calculator.loanReduction / 12).toFixed(1)} fewer loans per month
                        </div>
                        <p className="mt-2 text-sm leading-6 text-indigo-700/80">
                          That usually means fewer files in process, fewer conditions, fewer nights, and less weekend cleanup.
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-500">
                      Time-back estimates are simplified recruiting illustrations based on volume reduction and a basic productivity assumption. Actual hours, compensation, margins, pricing, and results vary by workflow, support model, loan mix, and market conditions.
                    </p>
                  </div>

                  <div className="space-y-4 lg:pt-0">
                    <InsightCard
                      eyebrow="Weekly estimate"
                      title={`${calculator.weeklyHoursBack.toFixed(1)} hours`}
                      copy="Estimated time back per week based on lower volume needed to match the same income."
                    />
                    <InsightCard
                      eyebrow="Annual estimate"
                      title={`${Math.round(calculator.yearlyHoursBack)} hours`}
                      copy="A simplified annual illustration of the time you may reclaim across a full working year."
                      dark
                    />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-indigo-200 bg-indigo-600 p-8 text-white shadow-lg">
                  <div className="max-w-4xl">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Key takeaway</div>
                    <p className="mt-3 text-lg leading-8 text-indigo-100">
                      Based on this illustration, stronger economics may allow you to keep your income while reducing the amount of volume you need to close. That can translate into real hours back each week — fewer files, fewer nights, fewer weekends, and more control over how you grow.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
<section className="border-y border-slate-200 bg-white">
  <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
      <div className="grid gap-10 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        
        <div>
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">
            Free Resource
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Download the Loan Officer Follow-Up Tracker
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A clean and practical follow-up system designed to help loan officers stay organized, track conversations, and maintain consistency with referral partners and borrowers.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="https://guiltless-garden-fd7.notion.site/524c25b8458783b5b11b81d4f34c13e0?v=abdc25b8458783508088088d233ef80d&source=copy_link"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-600"
            >
              Download the Free Follow-Up System
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>

            <div className="text-sm text-slate-500">
              Built in Notion • Duplicate and customize instantly
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Includes
          </div>

          <div className="mt-6 space-y-4">
            {[
              "Referral partner tracking",
              "Borrower follow-up organization",
              "Conversation notes",
              "Pipeline visibility",
              "Simple daily workflow",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
      <section id="faq" style={{ scrollMarginTop: "7rem" }} className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Common questions</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">The questions loan officers usually ask first</h2>
        </div>

        <div className="mt-10 space-y-4">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div key={faq.q} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-6 pb-6 pt-4 text-slate-600">
                    <p className="max-w-3xl leading-7">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section id="apply" style={{ scrollMarginTop: "7rem" }} className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-700 to-indigo-600 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Private recruiting conversation</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Curious what your business could look like at NEXA?</h2>
            <p className="mt-4 text-lg text-indigo-100">
              Schedule a confidential conversation. No pressure, just a clear look at how the model works and whether it fits your goals.
            </p>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:ring-white/20"
                placeholder="Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              <input
                className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:ring-white/20"
                placeholder="Email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
              <input
                className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:ring-white/20 sm:col-span-2"
                placeholder="Company"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
              />
              <textarea
                className="min-h-[140px] rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:ring-white/20 sm:col-span-2"
                placeholder="Goals"
                value={formGoals}
                onChange={(e) => setFormGoals(e.target.value)}
              />
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 sm:col-span-2"
              >
                Request Conversation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
