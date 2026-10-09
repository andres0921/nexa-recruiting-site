/**
 * Data for the NEXA comparison pages.
 *
 * KEEP THIS ACCURATE. Re-check sources and update ASOF before relying on it.
 * Where a company doesn't publish a number (retail LO pay varies by person),
 * the calculator asks the loan officer for their own number instead.
 */

export const ASOF = "October 2026";

export const nexa = {
  name: "NEXA Lending",
  /** What NEXA keeps per loan on the standard plan, in bps. */
  standardRetainBps: 54,
  /** Default gross comp per loan shown in the calculator, in bps. CONFIRM WITH ANDRES. */
  defaultGrossBps: 275,
  /** Monthly fee to show, or null if none/unconfirmed. CONFIRM WITH ANDRES. */
  monthlyFee: null,
};

/** Yearly LO income at NEXA (standard plan). */
export function nexaIncome({ volumeM, grossBps }) {
  const net = Math.max(0, grossBps - nexa.standardRetainBps);
  return volumeM * 1_000_000 * (net / 10_000) - (nexa.monthlyFee ?? 0) * 12;
}

export const companies = {
  barrett: {
    slug: "barrett-financial",
    name: "Barrett Financial Group",
    short: "Barrett",
    kind: "broker",
    model: "Mortgage broker with flat per-file fees",
    facts: [
      ["Model", "Broker or mini-correspondent, 1099 (W-2 where a state requires it)"],
      ["Per-file fee", "$695 flat per file"],
      ["Monthly fee", "$79 for loan origination system access"],
      ["Processing", "Optional in-house processing at $650 per file"],
      ["Lenders", "160+ lenders"],
      ["Licensing", "Licensed in 49 of 50 states"],
    ],
    /** Yearly LO income at Barrett for the same production and gross comp. */
    income({ volumeM, grossBps, avgLoan }) {
      const loans = avgLoan > 0 ? (volumeM * 1_000_000) / avgLoan : 0;
      return volumeM * 1_000_000 * (grossBps / 10_000) - loans * 695 - 79 * 12;
    },
    excludes: "Excludes Barrett's optional $650-per-file processing and credit report costs.",
    sources: [["Why Barrett — Barrett Financial's recruiting site", "https://www.whybarrett.com/why-barrett"]],
    pitch:
      "Barrett and NEXA are both broker models where you control your pricing and shop multiple lenders. We'll be straight with you: on fees alone, Barrett's flat $695 per file usually costs less than NEXA's 54 bps. The difference is everything around the fee — and that's what this page walks through.",
  },
  chase: {
    slug: "chase",
    name: "Chase Home Lending",
    short: "Chase",
    kind: "bank",
    model: "Bank retail lending — one lender's products, bank-set pricing",
    facts: [
      ["Model", "Retail loan officer at a bank, W-2 employee"],
      ["Products", "Chase's own loan products and pricing"],
      ["Pay", "Varies by loan officer and isn't published — enter yours in the calculator"],
      ["Brand", "Chase's brand and marketing rules"],
      ["Licensing", "Bank loan officers are federally registered in NMLS, not state-licensed"],
    ],
    sources: [["NMLS temporary authority overview (Montana DBFI)", "https://banking.mt.gov/MortgageConsumerFinance/TAO"]],
    pitch:
      "At a bank like Chase, you get a big brand, steady benefits, and a built-in customer base — but you sell one lender's products at the bank's pricing, under the bank's brand. At NEXA, you shop multiple lenders for your borrower, build your own brand, and have more control over your comp.",
  },
  rocket: {
    slug: "rocket-mortgage",
    name: "Rocket Mortgage",
    short: "Rocket",
    kind: "retail",
    model: "High-volume retail lender — company-generated leads, base pay plus commission",
    facts: [
      ["Model", "Retail loan officer, W-2 employee"],
      ["Pay", "Base salary plus commission, per Rocket's job postings — amounts vary"],
      ["Leads", "Company-generated leads, often handled over the phone"],
      ["Products", "Rocket's own loan products and pricing"],
      ["Licensing", "State-licensed (Rocket is a non-bank lender)"],
    ],
    sources: [["Rocket Mortgage loan officer job posting", "https://structuredfinance.org/jobs/nmls-licensed-loan-officer-rocket-mortgage-4/"]],
    pitch:
      "Rocket is built around volume: the company generates the leads, sets the pricing, and pays a base plus commission. That can be a great place to learn. At NEXA, you're building your own book of business and referral partners, with access to multiple lenders and more control over what you earn per loan.",
  },
  pnc: {
    slug: "pnc",
    name: "PNC Mortgage",
    short: "PNC",
    kind: "bank",
    model: "Bank retail lending — one lender's products, bank-set pricing",
    facts: [
      ["Model", "Retail loan officer at a bank, W-2 employee"],
      ["Products", "PNC's own loan products and pricing"],
      ["Pay", "Varies by loan officer and isn't published — enter yours in the calculator"],
      ["Brand", "PNC's brand and marketing rules"],
      ["Licensing", "Bank loan officers are federally registered in NMLS, not state-licensed"],
    ],
    sources: [["NMLS temporary authority overview (Montana DBFI)", "https://banking.mt.gov/MortgageConsumerFinance/TAO"]],
    pitch:
      "At a bank like PNC, you have a recognizable brand and bank customers to work with — but you're limited to one lender's products and pricing. At NEXA, you can shop multiple lenders for each borrower, market under your own name, and have more say in your comp.",
  },
};

export const companyList = [companies.barrett, companies.chase, companies.rocket, companies.pnc];

/** Retail/bank moves from a registered or licensed role — shown on bank pages. */
export const bankLicensingNote =
  "Bank loan officers are federally registered in NMLS rather than state-licensed. To join a state-licensed company like NEXA, you'll apply for a state license. If you've been registered continuously for the year before you apply, temporary authority can let you keep originating for up to 120 days while you finish the SAFE test, pre-licensing education, and state requirements.";

/** NEXA facts shown on every comparison page. UPDATE NEXA100 WORDING ONCE CONFIRMED. */
export const nexaFacts = [
  ["Model", "Broker plus NEXA's own lending — shop multiple lenders for each borrower"],
  ["Standard plan", `NEXA keeps ${nexa.standardRetainBps} bps per loan; you keep the rest of your comp`],
  ["NEXA100", "A path to keeping 100% of your comp — ask Andres for the current terms"],
  ["Brand", "Market under your own name and grow your personal brand"],
  ["Growth", "Earn on production from loan officers you bring to NEXA"],
]
