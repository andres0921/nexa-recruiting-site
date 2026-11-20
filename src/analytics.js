/**
 * Google Ads + GA4 tracking for paid traffic.
 *
 * Fill in the IDs below (or set the matching VITE_* env vars in Vercel).
 * While they're blank, nothing loads and every helper is a safe no-op,
 * so the site works the same before the Ads account is ready.
 *
 * Where to find them in Google Ads:
 *   Goals > Conversions > New conversion action > Website > "Use Google tag"
 *   The tag shows "AW-XXXXXXXXX/AbCdEfGhIj"; the part before the slash is
 *   ADS_ID, the part after is that conversion's label.
 */
export const ADS_CONFIG = {
  // Google Ads account tag, e.g. "AW-123456789"
  adsId: import.meta.env.VITE_GOOGLE_ADS_ID || "",
  // GA4 measurement ID, e.g. "G-ABC123XYZ" (optional)
  ga4Id: import.meta.env.VITE_GA4_ID || "",
  labels: {
    // Primary conversion: someone actually books a call in Calendly
    booked_call: import.meta.env.VITE_ADS_LABEL_BOOKED_CALL || "",
    // Secondary: tapped call/text
    contact_click: import.meta.env.VITE_ADS_LABEL_CONTACT || "",
    // Secondary: clicked the NEXA application link
    application_click: import.meta.env.VITE_ADS_LABEL_APPLICATION || "",
  },
}

const ATTR_KEY = "nexa_attribution"
const ATTR_PARAMS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]

const isBrowser = () => typeof window !== "undefined"

/** Remember where the visitor came from (first touch in this session). */
function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search)
    const found = {}
    for (const key of ATTR_PARAMS) {
      const v = params.get(key)
      if (v) found[key] = v.slice(0, 200)
    }
    if (Object.keys(found).length && !sessionStorage.getItem(ATTR_KEY)) {
      found.landing_page = window.location.pathname
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(found))
    }
  } catch {
    /* storage can be blocked; attribution is best-effort */
  }
}

export function getAttribution() {
  if (!isBrowser()) return {}
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) || "{}")
  } catch {
    return {}
  }
}

/** Load the Google tag once. Safe to call more than once. */
export function initAnalytics() {
  if (!isBrowser()) return
  captureAttribution()

  const ids = [ADS_CONFIG.adsId, ADS_CONFIG.ga4Id].filter(Boolean)
  if (!ids.length || window.__nexaTagLoaded) return
  window.__nexaTagLoaded = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag("js", new Date())
  for (const id of ids) window.gtag("config", id)

  const s = document.createElement("script")
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`
  document.head.appendChild(s)
}

/** Plain analytics event (GA4 + dataLayer). */
export function trackEvent(name, params = {}) {
  if (!isBrowser()) return
  try {
    window.gtag?.("event", name, params)
  } catch {
    /* analytics is optional */
  }
}

/**
 * Conversion: sends a GA4 event and, if a label is configured, a Google Ads
 * conversion. `kind` is one of the keys in ADS_CONFIG.labels.
 */
export function trackConversion(kind, params = {}) {
  trackEvent(kind, params)
  const label = ADS_CONFIG.labels[kind]
  if (!isBrowser() || !ADS_CONFIG.adsId || !label) return
  try {
    window.gtag?.("event", "conversion", { send_to: `${ADS_CONFIG.adsId}/${label}`, ...params })
  } catch {
    /* analytics is optional */
  }
}

/** Add the visitor's UTM tags to a Calendly link so bookings show the source. */
export function withAttribution(url) {
  const attr = getAttribution()
  try {
    const u = new URL(url)
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      if (attr[key] && !u.searchParams.has(key)) u.searchParams.set(key, attr[key])
    }
    // Ads auto-tagging sends gclid without UTMs; label those bookings as Google CPC.
    if ((attr.gclid || attr.gbraid || attr.wbraid) && !u.searchParams.has("utm_source")) {
      u.searchParams.set("utm_source", "google")
      u.searchParams.set("utm_medium", "cpc")
    }
    return u.toString()
  } catch {
    return url
  }
}
