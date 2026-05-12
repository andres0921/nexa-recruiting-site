import { useMemo, useState } from "react"
import {
  ArrowRight,
  Briefcase,
  Calculator,
  ChevronDown,
  Clock3,
  Menu,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react"

const SWITCH_NOW_URL = "https://loanofficersupport.com/r/Andres27520"
const CALENDLY_URL = "https://calendly.com/aaviles-nexalending/30min"
const FOLLOW_UP_TRACKER_URL =
  "https://guiltless-garden-fd7.notion.site/524c25b8458783b5b11b81d4f34c13e0?v=abdc25b8458783508088088d233ef80d&source=copy_link"

const SCROLL_MARGIN = { scrollMarginTop: "7rem" }

const NAV_LINKS = [
  { href: "#why-nexa", label: "Why NEXA" },
  { href: "#comparison", label: "Compare" },
  { href: "#calculator", label: "Calculator" },
  { href: "#faq", label: "FAQ" },
]

const HERO_FEATURES = [
  {
    icon: Calculator,
    title: "Educate",
    text: "Understand the model before making a move.",
  },
  {
    icon: Briefcase,
    title: "Recruit",
    text: "Attract aligned, entrepreneurial LOs.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    text: "Scale production with stronger economics.",
  },
]

const HERO_REASONS = [
  {
    label: "Ownership mindset",
    value: "Run your mortgage business like a real business.",
  },
  {
    label: "Better scalability",
    value: "Grow production without the usual retail ceiling.",
  },
  {
    label: "Modern platform",
    value: "Systems, flexibility, and support built for originators.",
  },
]

const WHY_NEXA_CARDS = [
  {
    title: "Education",
    text: "Understand the structure, compensation philosophy, and operating model before making any decisions.",
  },
  {
    title: "Opportunity",
    text: "See why experienced originators explore NEXA when they want more ownership, flexibility, and transparency.",
  },
  {
    title: "Growth",
    text: "Explore how the right platform can support production growth, team building, and long-term scalability.",
  },
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

const TRACKER_FEATURES = [
  "Referral partner tracking",
  "Borrower follow-up organization",
  "Conversation notes",
  "Pipeline visibility",
  "Simple daily workflow",
]

const FAQ_ITEMS = [
  {
    q: "How does compensation work at NEXA?",
    a: "NEXA uses a structure designed to give producing loan officers more transparency and control over their margins compared to many traditional retail models.",
  },
  {
    q: "What support systems are available?",
    a: "Loan officers can access processing support, technology systems, training resources, and a national network of experienced originators.",
  },
  {
    q: "Is the transition difficult?",
    a: "Most loan officers find the transition simpler when the process is planned correctly. The first conversation usually covers timeline, licensing, setup, and what would need to happen before making any move.",
  },
  {
    q: "Can I build my own brand?",
    a: "Yes. Many originators use NEXA as the operational backbone while continuing to grow their personal brand and referral network.",
  },
]

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const AVERAGE_LOAN_SIZE = 400_000
const HOURS_BACK_PER_MILLION = 2
const WORKING_WEEKS_PER_YEAR = 48

function sanitizeNumberText(value) {
  const cleaned = value.replace(/[^0-9.]/g, "")
  const [whole, ...decimalParts] = cleaned.split(".")

  if (decimalParts.length === 0) return whole

  return `${whole}.${decimalParts.join("")}`
}

function toPositiveNumber(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatCurrency(value) {
  return USD_FORMATTER.format(value)
}

function formatMillions(value) {
  if (!Number.isFinite(value)) return "—"
  return `$${value >= 10 ? value.toFixed(1) : value.toFixed(2)}M`
}

function buildCalendlyUrl(form) {
  const params = new URLSearchParams()
  const trimmed = Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, value.trim()]),
  )

  if (trimmed.name) params.set("name", trimmed.name)
  if (trimmed.email) params.set("email", trimmed.email)
  if (trimmed.company) params.set("a1", trimmed.company)
  if (trimmed.goals) params.set("a2", trimmed.goals)

  const query = params.toString()
  return `${CALENDLY_URL}${query ? `?${query}` : ""}`
}

function ButtonLink({ href, children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-indigo-600 text-white shadow-lg hover:scale-[1.02] hover:bg-indigo-700",
    dark: "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-indigo-600",
    light: "border border-slate-300 bg-white text-slate-950 shadow-sm hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700",
    white: "bg-white text-indigo-700 shadow-lg hover:-translate-y-0.5 hover:bg-slate-100",
  }

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}

function Pill({ children, dark = false }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] shadow-sm ${
        dark
          ? "border-white/15 bg-white/10 text-indigo-100"
          : "border-indigo-100 bg-white text-indigo-600"
      }`}
    >
      {children}
    </div>
  )
}

function SectionHeader({ eyebrow, title, copy, centered = false, dark = false }) {
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl`}>
      <p
        className={`text-sm font-semibold uppercase tracking-[0.2em] ${
          dark ? "text-indigo-200" : "text-indigo-600"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-semibold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {copy ? (
        <p className={`mt-5 text-lg leading-8 ${dark ? "text-indigo-100" : "text-slate-600"}`}>
          {copy}
        </p>
      ) : null}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-semibold text-slate-950">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-600">{text}</div>
    </div>
  )
}

function StatCard({ label, value, accent = false, full = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-indigo-100 bg-indigo-50" : "border-slate-200 bg-slate-50"
      } ${full ? "sm:col-span-2" : ""}`}
    >
      <div className={`text-sm ${accent ? "text-indigo-700" : "text-slate-500"}`}>{label}</div>
      <div
        className={`mt-2 text-3xl font-semibold tracking-tight ${
          accent ? "text-indigo-700" : "text-slate-950"
        }`}
      >
        {value}
      </div>
    </div>
  )
}

function NumberInput({ id, label, value, onChange, step = "1", helper, suffix, icon }) {
  return (
    <label htmlFor={id} className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {icon ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
              {icon}
            </span>
          ) : null}
          <span>{label}</span>
        </div>
        {suffix ? (
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{suffix}</span>
        ) : null}
      </div>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(event) => onChange(sanitizeNumberText(event.target.value))}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        placeholder="Enter value"
        aria-describedby={helper ? `${id}-helper` : undefined}
      />
      {helper ? (
        <div id={`${id}-helper`} className="mt-2 pl-9 text-xs leading-5 text-slate-500">
          {helper}
        </div>
      ) : null}
    </label>
  )
}

function InsightCard({ eyebrow, title, copy, dark = false }) {
  return (
    <div className={`rounded-2xl p-6 ${dark ? "bg-slate-900 text-white" : "bg-indigo-600 text-white"}`}>
      <div className={`text-sm uppercase tracking-[0.2em] ${dark ? "text-slate-300" : "text-indigo-200"}`}>
        {eyebrow}
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{title}</div>
      <p className={`mt-2 leading-7 ${dark ? "text-slate-300" : "text-indigo-100"}`}>{copy}</p>
    </div>
  )
}

function BulletList({ items, accent = "indigo" }) {
  const dotClass = accent === "muted" ? "text-slate-400" : "h-2 w-2 rounded-full bg-indigo-500"

  return (
    <ul className="mt-6 space-y-3 text-slate-600">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          {accent === "muted" ? (
            <span className={`mt-1 ${dotClass}`}>—</span>
          ) : (
            <span className={`mt-2 shrink-0 ${dotClass}`} />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function TextField({ id, label, value, onChange, type = "text", className = "" }) {
  return (
    <label htmlFor={id} className={className}>
      <span className="sr-only">{label}</span>
      <input
        id={id}
        type={type}
        className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}

function TextAreaField({ id, label, value, onChange, className = "" }) {
  return (
    <label htmlFor={id} className={className}>
      <span className="sr-only">{label}</span>
      <textarea
        id={id}
        className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
        placeholder={label}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}

function Header({ mobileMenuOpen, setMobileMenuOpen }) {
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <a href="#top" className="flex items-end gap-4" onClick={closeMobileMenu}>
          <img src="/NEXAMortgage.png" alt="NEXA Mortgage" className="h-14 w-auto object-contain lg:h-[4.5rem]" />
          <div className="hidden flex-col justify-end pb-1 leading-none sm:flex">
            <span className="text-xs text-slate-500">Loan Officer Growth Platform</span>
          </div>
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition duration-200 hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="#apply" variant="dark" className="rounded-full px-6 py-2.5">
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href="#apply" variant="dark" onClick={closeMobileMenu} className="mt-2 rounded-xl px-4 py-3">
              Book a Call
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function HeroSection() {
  return (
    <section
      id="top"
      style={SCROLL_MARGIN}
      className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(to_bottom_right,_#eef2ff,_#ffffff,_#eff6ff)]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            NEXA Loan Officer Opportunity
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            The platform serious loan officers move to when they want more control.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            If you are a producing loan officer wondering what your next level could look like, NEXA offers a model built around autonomy, scalability, and stronger economics.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="#apply">Schedule a Private Conversation</ButtonLink>
            <ButtonLink href="#why-nexa" variant="light">
              Learn How the Model Works
            </ButtonLink>
          </div>

          <div className="mt-10 grid max-w-xl gap-4 text-sm text-slate-600 sm:grid-cols-3">
            {HERO_FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 text-white">
              <div className="text-sm uppercase tracking-[0.2em] text-indigo-200">Why LOs move to NEXA</div>
              <div className="mt-4 space-y-4">
                {HERO_REASONS.map((reason) => (
                  <div key={reason.label} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                    <div className="text-sm text-indigo-100">{reason.label}</div>
                    <div className="mt-1 text-xl font-semibold">{reason.value}</div>
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
  )
}

function WhyNexaSection() {
  return (
    <section id="why-nexa" style={SCROLL_MARGIN} className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Why experienced loan officers explore NEXA"
        title="This is not about switching companies. It is about upgrading your platform."
        copy="Most producing loan officers eventually ask the same questions: Could my margins be better? Could my business be more scalable? Could I operate with more autonomy? This page walks through those answers clearly and transparently."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {WHY_NEXA_CARDS.map((card) => (
          <div key={card.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-xl font-semibold text-slate-950">{card.title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function IdealLoanOfficerSection() {
  return (
    <section id="ideal-lo" style={SCROLL_MARGIN} className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Who fits best here</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">Loan officers who think like entrepreneurs</h3>
            <BulletList items={IDEAL_LO_POINTS} />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Mindset shift</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">You are not just joining a brokerage. You are building your platform.</h3>
            <p className="mt-6 leading-7 text-slate-600">
              The most successful originators treat their mortgage business like a real company. NEXA is designed for that type of professional: someone who wants freedom, scalability, and a long-term growth platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  return (
    <section id="comparison" style={SCROLL_MARGIN} className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeader
        eyebrow="Model comparison"
        title="Traditional retail model vs. the NEXA model"
        copy="Many loan officers start in traditional retail environments. Over time, experienced originators begin exploring models that offer more flexibility, transparency, and scalability."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-stretch">
        <div className="h-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-950">Traditional Retail Model</h3>
          <BulletList items={RETAIL_MODEL_POINTS} accent="muted" />
        </div>

        <div className="relative h-full overflow-hidden rounded-[2rem] border-2 border-indigo-500 bg-white p-8 shadow-md">
          <div className="absolute right-4 top-4 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            Preferred
          </div>
          <h3 className="text-xl font-semibold text-indigo-700">NEXA Model</h3>
          <BulletList items={NEXA_MODEL_POINTS} />
        </div>
      </div>
    </section>
  )
}

function IncomeIllustrationSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <SectionHeader
        centered
        eyebrow="Income illustration"
        title="Potential to earn the same income with less volume"
        copy="Many producing loan officers discover that stronger economics can allow them to generate similar or greater income while closing fewer loans, which can mean fewer hours, less stress, and more control over their schedule."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-stretch">
        <div className="h-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Typical Retail Scenario</h3>
          <div className="mt-6 space-y-3 text-slate-600">
            <p>
              Annual Production: <span className="font-semibold">$30M</span>
            </p>
            <p>
              Average Comp: <span className="font-semibold">~100 bps</span>
            </p>
            <p>
              Estimated Income: <span className="font-semibold">$300,000</span>
            </p>
          </div>
          <div className="mt-6 text-sm leading-6 text-slate-500">
            Many retail environments require higher production volume to reach top income levels.
          </div>
        </div>

        <div className="relative h-full overflow-hidden rounded-[2rem] border-2 border-indigo-500 bg-white p-8 shadow-md">
          <div className="absolute right-4 top-4 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            Illustration
          </div>
          <h3 className="text-xl font-semibold text-indigo-700">Example NEXA Scenario</h3>
          <div className="mt-6 space-y-3 text-slate-600">
            <p>
              Annual Production: <span className="font-semibold">$20M</span>
            </p>
            <p>
              Average Comp: <span className="font-semibold">~150 bps</span>
            </p>
            <p>
              Estimated Income: <span className="font-semibold">$300,000</span>
            </p>
          </div>
          <div className="mt-6 text-sm font-medium leading-6 text-indigo-600">
            Similar income potential with lower volume can translate to fewer working hours and a more scalable business.
          </div>
        </div>
      </div>
    </section>
  )
}

function CalculatorSection({ calculatorInputs, setCalculatorInputs }) {
  const currentVolume = toPositiveNumber(calculatorInputs.retailVolume)
  const retailBps = toPositiveNumber(calculatorInputs.retailBps)
  const nexaBps = toPositiveNumber(calculatorInputs.nexaBps)
  const calculatorReady = currentVolume > 0 && retailBps > 0 && nexaBps > 0

  const calculator = useMemo(() => {
    if (!calculatorReady) return null

    const retailIncome = currentVolume * 1_000_000 * (retailBps / 10_000)
    const equivalentNexaVolume = retailIncome / (nexaBps / 10_000) / 1_000_000
    const volumeReduction = Math.max(currentVolume - equivalentNexaVolume, 0)
    const loanReduction = Math.max((volumeReduction * 1_000_000) / AVERAGE_LOAN_SIZE, 0)
    const weeklyHoursBack = volumeReduction * HOURS_BACK_PER_MILLION
    const yearlyHoursBack = weeklyHoursBack * WORKING_WEEKS_PER_YEAR

    return {
      retailIncome,
      equivalentNexaVolume,
      volumeReduction,
      loanReduction,
      weeklyHoursBack,
      yearlyHoursBack,
    }
  }, [calculatorReady, currentVolume, retailBps, nexaBps])

  const updateInput = (field) => (value) => {
    setCalculatorInputs((previous) => ({ ...previous, [field]: value }))
  }

  return (
    <section id="calculator" style={SCROLL_MARGIN} className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center lg:text-left">
          <Pill>
            <Clock3 className="h-4 w-4" />
            Interactive calculator
          </Pill>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
            See how much time you may get back while earning the same income
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start with your current volume and compensation, then compare it to a hypothetical NEXA comp scenario. The calculator answers three questions: what you make now, what volume you may need at NEXA, and how much time and file load that difference may give back.
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
                      Use rough production and comp assumptions to unlock the comparison.
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      calculatorReady ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {calculatorReady ? "Ready" : "3 inputs"}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <NumberInput
                  id="retail-volume"
                  label="Current annual retail production"
                  value={calculatorInputs.retailVolume}
                  onChange={updateInput("retailVolume")}
                  helper="Example: 30 means $30M in annual production."
                  suffix="Millions"
                  icon="1"
                />
                <NumberInput
                  id="retail-bps"
                  label="Current retail compensation"
                  value={calculatorInputs.retailBps}
                  onChange={updateInput("retailBps")}
                  step="5"
                  helper="Example: 100 bps = 1.00% comp."
                  suffix="BPS"
                  icon="2"
                />
                <NumberInput
                  id="nexa-bps"
                  label="Estimated NEXA compensation"
                  value={calculatorInputs.nexaBps}
                  onChange={updateInput("nexaBps")}
                  step="5"
                  helper="Use your best estimate for a same-income comparison."
                  suffix="BPS"
                  icon="3"
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border-2 border-indigo-500 bg-white p-6 shadow-xl lg:rounded-l-[1.1rem] xl:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Step 2</div>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">Same-income snapshot</h3>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    calculatorReady ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {calculatorReady ? "Built for quick recruiting conversations" : "Complete Step 1 to reveal results"}
                </div>
              </div>

              <div className="relative mt-6">
                <div
                  className={`grid gap-4 transition md:grid-cols-2 xl:grid-cols-4 ${
                    calculatorReady ? "opacity-100" : "opacity-30 blur-[2px]"
                  }`}
                >
                  <StatCard label="Current estimated income" value={calculator ? formatCurrency(calculator.retailIncome) : "—"} />
                  <StatCard label="Volume needed at NEXA" value={calculator ? formatMillions(calculator.equivalentNexaVolume) : "—"} accent />
                  <StatCard label="Annual volume reduction" value={calculator ? formatMillions(calculator.volumeReduction) : "—"} />
                  <StatCard label="Time back" value={calculator ? `${calculator.weeklyHoursBack.toFixed(1)} hrs/wk` : "—"} accent />
                </div>

                {!calculatorReady ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-xl bg-white/90 px-6 py-3 text-sm font-medium text-slate-700 shadow">
                      Enter your numbers to reveal the comparison
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {calculatorReady && calculator ? (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm lg:rounded-t-[1.1rem] xl:p-8">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Step 3</div>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">What the reduction can feel like</h3>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <StatCard label="Estimated loan file reduction" value={`${calculator.loanReduction.toFixed(0)} fewer loans / year`} accent full />
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
                    This is a simplified recruiting illustration. Actual hours, compensation, margins, pricing, support, loan mix, and results vary by originator, workflow, and market conditions.
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
                    Based on this illustration, stronger economics may allow you to keep your income while reducing the amount of volume you need to close. That can translate into real hours back each week: fewer files, fewer nights, fewer weekends, and more control over how you grow.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function LeadMagnetSection() {
  return (
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
                A practical follow-up system designed to help loan officers stay organized, track conversations, and maintain consistency with referral partners and borrowers.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href={FOLLOW_UP_TRACKER_URL} target="_blank" rel="noreferrer" variant="dark">
                  Download the Free Follow-Up System
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>

                <div className="text-sm text-slate-500">Built in Notion • Duplicate and customize instantly</div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Includes</div>

              <div className="mt-6 space-y-4">
                {TRACKER_FEATURES.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700">
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
  )
}

function FAQSection({ openFaq, setOpenFaq }) {
  return (
    <section id="faq" style={SCROLL_MARGIN} className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeader eyebrow="Common questions" title="The questions loan officers usually ask first" />

      <div className="mt-10 space-y-4">
        {FAQ_ITEMS.map((faq, index) => {
          const isOpen = openFaq === index
          const answerId = `faq-answer-${index}`

          return (
            <div key={faq.q} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
                aria-controls={answerId}
              >
                <span className="text-lg font-semibold text-slate-900">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen ? (
                <div id={answerId} className="border-t border-slate-100 px-6 pb-6 pt-4 text-slate-600">
                  <p className="max-w-3xl leading-7">{faq.a}</p>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ApplySection({ form, setForm }) {
  const calendlyUrl = useMemo(() => buildCalendlyUrl(form), [form])
  const updateForm = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }))
  }

  return (
    <section id="apply" style={SCROLL_MARGIN} className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-700 to-indigo-600 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Private recruiting conversation</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Curious what your business could look like at NEXA?</h2>
          <p className="mt-4 text-lg leading-8 text-indigo-100">
            Schedule a confidential conversation. No pressure, just a clear look at how the model works and whether it fits your goals.
          </p>
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="lead-name" label="Name" value={form.name} onChange={updateForm("name")} />
            <TextField id="lead-email" label="Email" type="email" value={form.email} onChange={updateForm("email")} />
            <TextField id="lead-company" label="Company" value={form.company} onChange={updateForm("company")} className="sm:col-span-2" />
            <TextAreaField id="lead-goals" label="Goals" value={form.goals} onChange={updateForm("goals")} className="sm:col-span-2" />
            <ButtonLink href={calendlyUrl} target="_blank" rel="noreferrer" variant="white" className="sm:col-span-2">
              Request Conversation
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-8 text-sm text-slate-400 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} NEXA Loan Officer Growth Platform</p>
        <p className="max-w-2xl sm:text-right">
          Income examples are illustrative only. Results vary by originator, market, pricing, loan mix, and operating model.
        </p>
      </div>
    </footer>
  )
}

export default function NEXARecruitingSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [calculatorInputs, setCalculatorInputs] = useState({
    retailVolume: "",
    retailBps: "",
    nexaBps: "",
  })
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    goals: "",
  })

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <ButtonLink
        href={SWITCH_NOW_URL}
        target="_blank"
        rel="noreferrer"
        variant="dark"
        className="fixed bottom-5 right-5 z-50 rounded-full px-5 py-3 shadow-2xl ring-1 ring-white/10"
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
        Switch Now
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>

      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main>
        <HeroSection />
        <WhyNexaSection />
        <IdealLoanOfficerSection />
        <ComparisonSection />
        <IncomeIllustrationSection />
        <CalculatorSection calculatorInputs={calculatorInputs} setCalculatorInputs={setCalculatorInputs} />
        <LeadMagnetSection />
        <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <ApplySection form={form} setForm={setForm} />
      </main>
      <Footer />
    </div>
  )
}
