import { nexa } from "./compare/companies.js"

/** Shared by the page and the build-time FAQ schema (routes.jsx). */
export const FAQ_ITEMS = [
  {
    q: "How does loan officer compensation work at NEXA?",
    a: `On NEXA's standard plan, NEXA keeps ${nexa.standardRetainBps} bps per loan and you keep the rest of your comp. Your comp per loan depends on the lender and how the loan is priced, so the calculator on this page lets you plug in your own volume and bps.`,
  },
  {
    q: "What is NEXA100?",
    a: `On NEXA100, the ${nexa.standardRetainBps} bps that would go to NEXA goes into your operational budget instead, which you can use to get reimbursed for business expenses. Ask Andres about eligibility.`,
  },
  {
    q: "How is the broker model different from retail?",
    a: "At a retail lender or bank, you sell one company's products at the pay plan they set. As a broker loan officer at NEXA, you can shop multiple lenders for each borrower, see the pricing, and market under your own name.",
  },
  {
    q: "What support systems are available?",
    a: "Loan officers have access to processing support, technology systems, training resources, and a national network of experienced originators.",
  },
  {
    q: "Is the transition difficult?",
    a: "Most loan officers find the transition much simpler than expected when it's planned correctly. Andres walks through timelines, licensing, and setup with you during the first conversations, so your pipeline doesn't stall.",
  },
  {
    q: "Can I build my own brand?",
    a: "Yes. Many originators use NEXA as the operational backbone while they keep growing their personal brand and referral network.",
  },
]
