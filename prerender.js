// Build step: render the page to static HTML and inject it into dist/index.html.
// Runs after `vite build` and `vite build --ssr` (see package.json "build").
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.dirname(fileURLToPath(import.meta.url))
const indexPath = path.join(root, "dist", "index.html")
const ssrDir = path.join(root, "dist-ssr")

const { render, faqJsonLd } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
)

let html = fs.readFileSync(indexPath, "utf-8")
for (const [marker, value] of [
  ["<!--app-html-->", render()],
  ["<!--faq-jsonld-->", faqJsonLd()],
]) {
  if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found`)
  html = html.replace(marker, value)
}

fs.writeFileSync(indexPath, html)
fs.rmSync(ssrDir, { recursive: true, force: true })
console.log("prerender: wrote static HTML into dist/index.html")
