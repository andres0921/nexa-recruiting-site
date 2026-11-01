import App from "./App.jsx"
import { FAQ_ITEMS } from "./faq.js"
import { CompareHub } from "./compare/CompareHub.jsx"
import { ComparePage } from "./compare/ComparePage.jsx"
import { compareFaqs } from "./compare/faqs.js"
import { ASOF, companyList } from "./compare/companies.js"

export const SITE_URL = "https://nexavsretail.com"
export const OG_IMAGE = `${SITE_URL}/og-image.png`
export const LOGO = `${SITE_URL}/NEXAMortgage.png`

export const author = {
  "@type": "Person",
  name: "Andres Aviles",
  jobTitle: "Mortgage Loan Officer, NEXA Lending",
  url: "https://www.andresaviles.com",
  identifier: { "@type": "PropertyValue", propertyID: "NMLS", value: "2640511" },
}

export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
})

/**
 * Every page on the site. Each is pre-rendered at build time to dist/<file>
 * with its own title, description, canonical and schema (see prerender.js);
 * the browser then hydrates the matching component (see main.jsx).
 */
export const routes = [
  {
    path: "/",
    file: "index.html",
    title: "Broker vs Retail Loan Officer Pay | NEXA vs Retail",
    description:
      "Retail vs. broker for loan officers: on NEXA Lending's standard plan, NEXA keeps 54 bps per loan and you keep the rest. Compare comp and run your numbers.",
    ogDescription:
      "What loan officers actually keep at a retail lender vs. NEXA Lending, with a calculator for your own volume and bps.",
    Component: App,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: "Broker vs Retail Loan Officer Pay | NEXA vs Retail",
        inLanguage: "en-US",
        about: { "@type": "Organization", name: "NEXA Mortgage, LLC", alternateName: "NEXA Lending", logo: LOGO },
        author,
      },
      faqSchema(FAQ_ITEMS),
    ],
  },
]

const crumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
  })),
})

const webPage = (path, name, description) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: `${SITE_URL}${path}`,
  name,
  description,
  inLanguage: "en-US",
  author,
})

routes.push({
  path: "/compare",
  file: "compare.html",
  title: "Compare LO Comp: NEXA vs Barrett, Chase, Rocket & PNC",
  description: `Where loan officers keep more: NEXA Lending vs Barrett Financial, Chase, Rocket Mortgage, and PNC. Comp models, fees, licensing, and a calculator.`,
  Component: CompareHub,
  jsonLd: [
    webPage("/compare", "Compare Mortgage Companies for Loan Officers", "Loan officer comp and model comparison."),
    crumbs([["Home", "/"], ["Compare", "/compare"]]),
  ],
})

for (const c of companyList) {
  const path = `/compare/${c.slug}`
  const year = ASOF.split(" ")[1]
  const fullTitle = `NEXA vs ${c.name}: Loan Officer Comp Compared (${year})`
  const title = fullTitle.length <= 60 ? fullTitle : `NEXA vs ${c.name}: LO Comp Compared (${year})`
  const description = `Thinking about leaving ${c.name}? Compare loan officer comp, fees, and licensing at NEXA Lending, with a calculator for your own numbers.`
  routes.push({
    path,
    file: `compare/${c.slug}.html`,
    title,
    description,
    Component: () => <ComparePage company={c} />,
    jsonLd: [
      webPage(path, title, description),
      crumbs([["Home", "/"], ["Compare", "/compare"], [`NEXA vs ${c.short}`, path]]),
      faqSchema(compareFaqs(c)),
    ],
  })
}

/** Normalize a browser pathname ("/compare/", "/index.html") to a route. */
export function findRoute(pathname) {
  const p = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/(.)\/$/, "$1") || "/"
  return routes.find((r) => r.path === p) ?? routes[0]
}
