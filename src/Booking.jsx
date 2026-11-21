import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { trackConversion, trackEvent, withAttribution } from "./analytics.js"
import { CALENDLY_URL, OPEN_EVENT } from "./booking-actions.js"

function embedUrl(url, type = "PopupWidget") {
  try {
    const u = new URL(withAttribution(url))
    u.searchParams.set("embed_domain", window.location.host)
    u.searchParams.set("embed_type", type)
    u.searchParams.set("hide_gdpr_banner", "1")
    return u.toString()
  } catch {
    return url
  }
}

/** Mount once per page. Listens for openBooking() and Calendly's booking messages. */
export function BookingModal() {
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    const onOpen = (e) => setBooking({ cta: e.detail?.cta || "unknown", src: embedUrl(e.detail?.url || CALENDLY_URL) })
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!booking) return undefined
    const onMessage = (e) => {
      if (e.origin !== "https://calendly.com" || typeof e.data?.event !== "string") return
      if (e.data.event === "calendly.date_and_time_selected") trackEvent("booking_time_selected", { cta: booking.cta })
      if (e.data.event === "calendly.event_scheduled") trackConversion("booked_call", { cta: booking.cta })
    }
    const onKey = (e) => e.key === "Escape" && setBooking(null)
    window.addEventListener("message", onMessage)
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("message", onMessage)
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [booking])

  if (!booking) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a call with Andres"
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={() => setBooking(null)}
    >
      <div
        className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl sm:h-[min(760px,92vh)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <span className="text-sm font-semibold text-slate-900">Book a 30-minute call with Andres</span>
          <button
            type="button"
            onClick={() => setBooking(null)}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <iframe title="Schedule a call with Andres Aviles" src={booking.src} className="min-h-0 w-full flex-1 border-0" />
      </div>
    </div>
  )
}

/**
 * Calendly calendar shown directly on the page. The src is set after mount
 * (it needs the visitor's UTMs and domain), so the pre-rendered HTML just
 * shows the placeholder until the browser takes over.
 */
export function InlineBooking({ cta = "inline_calendar" }) {
  const [src, setSrc] = useState("")
  const boxRef = useRef(null)

  // Load Calendly only when the visitor gets near the calendar (keeps the first page load fast).
  useEffect(() => {
    const el = boxRef.current
    if (!el) return undefined
    const load = () => setSrc(embedUrl(CALENDLY_URL, "Inline"))
    if (!("IntersectionObserver" in window)) {
      const t = setTimeout(load, 0)
      return () => clearTimeout(t)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load()
          io.disconnect()
        }
      },
      { rootMargin: "800px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== "https://calendly.com" || typeof e.data?.event !== "string") return
      if (e.data.event === "calendly.date_and_time_selected") trackEvent("booking_time_selected", { cta })
      if (e.data.event === "calendly.event_scheduled") trackConversion("booked_call", { cta })
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [cta])

  return (
    <div ref={boxRef} className="overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">
      {src ? (
        <iframe
          title="Pick a time to talk with Andres Aviles"
          src={src}
          loading="lazy"
          className="block h-[760px] w-full border-0 sm:h-[700px]"
        />
      ) : (
        <div className="flex h-[700px] items-center justify-center text-sm text-slate-500">Loading calendar…</div>
      )}
      <noscript>
        <a href={CALENDLY_URL} className="block p-6 text-center font-semibold text-indigo-700">Open the booking calendar</a>
      </noscript>
    </div>
  )
}
