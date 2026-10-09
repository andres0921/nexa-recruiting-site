// Build step: pre-render every route in src/routes.jsx to its own HTML file
// with page-specific head tags, then write sitemap.xml.
// Runs after `vite build` and `vite build --ssr` (see package.json "build").
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, routes, SITE_URL, OG_IMAGE } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
for (const marker of ["<!--head-->", "<!--app-html-->"]) {
  if (!template.includes(marker)) throw new Error(`prerender: ${marker} missing`);
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function head(route) {
  const url = route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
  const ogDesc = route.ogDescription ?? route.description;
  const image = OG_IMAGE;
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="NEXA vs Retail" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(ogDesc)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="NEXA Mortgage" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(ogDesc)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(route.jsonLd ?? []).map(
      (d) =>
        `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`
    ),
  ];
  return tags.join("\n    ");
}

for (const route of routes) {
  const out = path.join(dist, route.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const html = template
    .replace("<!--head-->", head(route))
    .replace("<!--app-html-->", render(route));
  fs.writeFileSync(out, html);
  console.log(`prerender: ${route.path} -> dist/${route.file}`);
}

const urls = routes
  .map((r) => {
    const loc = r.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${r.path === "/" ? "1.0" : "0.8"}</priority>\n  </url>`;
  })
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: sitemap.xml with ${routes.length} URLs`);
