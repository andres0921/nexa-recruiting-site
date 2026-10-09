/* eslint-disable react-refresh/only-export-components -- build-time server entry, not a hot-reloaded module */
import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { routes, SITE_URL, OG_IMAGE } from "./routes.jsx"

/**
 * Used only at build time (see prerender.js) to bake each page's HTML, so
 * search engines and link previews see the real content without running
 * JavaScript first. The browser then hydrates it (see main.jsx).
 */
export { routes, SITE_URL, OG_IMAGE }

export function render(route) {
  const { Component } = route
  return renderToString(
    <StrictMode>
      <Component />
    </StrictMode>,
  )
}
