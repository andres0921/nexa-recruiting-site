import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import App from "./App.jsx"
import { FAQ_ITEMS } from "./faq.js"

/**
 * Used only at build time (see prerender.js) to bake the page's HTML into
 * dist/index.html, so search engines and link previews see the real content
 * without having to run JavaScript first. The browser then hydrates it.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

/** FAQPage structured data, generated from the same FAQ list the page shows. */
export function faqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`
}
