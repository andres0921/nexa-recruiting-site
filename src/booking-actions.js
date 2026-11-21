import { trackEvent } from "./analytics.js"

export const CALENDLY_URL = "https://calendly.com/aaviles-nexalending/let-s-meet"
export const OPEN_EVENT = "nexa:open-booking"

/**
 * Open the Calendly booking window on this page. Keeping the visitor here
 * (instead of a new tab) is what lets a finished booking count as a
 * Google Ads conversion.
 */
export function openBooking(cta, url = CALENDLY_URL) {
  trackEvent("booking_open", { cta })
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { cta, url } }))
}

/** Click handler for any <a href={CALENDLY_URL}>: opens the modal, falls back to the link. */
export function bookingClick(cta, url = CALENDLY_URL) {
  return (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
    e.preventDefault()
    openBooking(cta, url)
  }
}
