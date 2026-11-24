# Google Ads extra conversions — ready-to-build spec

**Status:** Proposal only. Do not publish the GTM container, and do not merge this branch to `main` until Andres has created the Google Ads actions, supplied the labels, and approved a publish.

**Site:** https://nexavsretail.com
**GTM container:** `GTM-KJ2N9SXK` (live version 3, rechecked from `gtm.js` on Nov 23, 2026, America/Chicago)
**Google Ads account:** `492-024-5566`
**Google tag / conversion ID:** `AW-18004514734` (GTM field uses the bare number `18004514734`)
**Already live:** booked_call conversion tag (label `9g1eCL-flr4dEK6vnIID`) on a Custom Event trigger, plus the Conversion Linker.

This spec adds three secondary (micro) conversions: `booking_time_selected`, `contact_click`, and `application_click`. Site code in `src/analytics.js` must keep `adsId`, `ga4Id`, and all labels blank so the direct gtag path cannot double-count what GTM already sends.

A merge-only import file for the three new triggers and three new tags lives at [`docs/gtm-extra-conversions-import.json`](./gtm-extra-conversions-import.json). Labels in that file are placeholders and must be replaced before publish.

---

## 1. How the site fires each event

Every helper in `src/analytics.js` pushes `{ event: <name>, ...params, ...attribution }` to `window.dataLayer`. If first-touch attribution was captured this session, the event also carries any of `gclid`, `gbraid`, `wbraid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, and `landing_page`.

`trackEvent` always does that dataLayer push. `trackConversion` calls `trackEvent` first, then would also send a direct `gtag('event', 'conversion', …)` **only if** `ADS_CONFIG.adsId` and the matching label were set. They are blank by design, so GTM is the only conversion sender.

There is no event-name filter needed beyond the exact Custom Event name. None of the three events currently exist in the live container (only `booked_call` does).

### 1.1 `booking_time_selected`

| | |
| --- | --- |
| How it is sent | `trackEvent("booking_time_selected", { cta })` — not `trackConversion` |
| When it fires | Calendly posts `calendly.date_and_time_selected` (origin `https://calendly.com`) after the visitor picks a date and time, before they finish the booking |
| Where | **Home (`/`):** inline calendar in the `#apply` section (`InlineBooking`, `cta: "apply_inline"`). **Compare pages (`/compare` and `/compare/<slug>`):** Calendly modal opened from a “Talk to Andres” / book button (`BookingModal`) |
| Event params | `cta` (string). Values in code today: `apply_inline`, `compare_header`, `compare_hub_footer`, `ai_compare_result`, and on company pages `compare_<slug>_hero`, `compare_<slug>_friends`, `compare_<slug>_footer` where `<slug>` is `barrett-financial`, `chase`, `rocket-mortgage`, or `pnc`. Plus attribution when present. |
| Can it fire more than once per visit? | **Yes.** A visitor can go back in Calendly and pick another time. Each selection pushes another `booking_time_selected`. The home page and compare pages do **not** mount both listeners at once (`InlineBooking` is home-only; `BookingModal` is compare-only), so a single selection is not double-counted by two components. |

### 1.2 `contact_click`

| | |
| --- | --- |
| How it is sent | `trackConversion("contact_click", { method })` |
| When it fires | Click on the text or call link under the home-page calendar |
| Where | Home page only, `#apply` section in `src/NEXARecruitingSite.jsx`. Not present on compare pages. |
| Event params | `method`: `"sms"` (link `sms:+12149085914`, visible text “Text 214-908-5914”) or `"call"` (link `tel:+12149085914`, visible text “call”). There is **no email** method and no other contact type. Plus attribution when present. |
| Can it fire more than once per visit? | **Yes.** There is no debounce. Clicking both links, or the same link twice, pushes multiple events. |

The privacy page has untracked `mailto:loans@andresaviles.com` and `tel:+12149085914` links. Those do not send `contact_click`. That is a gap, not something this proposal changes.

### 1.3 `application_click`

| | |
| --- | --- |
| How it is sent | `trackConversion("application_click")` — no destination param |
| When it fires | Click on “Start your NEXA application” |
| Where | Home page only, `#apply` section, below the contact line |
| Destination (in the `href`, not in the dataLayer) | `https://loanofficersupport.com/r/Andres27520` (opens in a new tab) |
| Event params | None besides the event name and attribution when present. The application URL is **not** pushed as a parameter. |
| Can it fire more than once per visit? | **Yes.** No debounce; repeated clicks each push the event. |

---

## 2. Google Ads conversion actions to create

Create these in account `492-024-5566` as **manual website conversion actions** that use the **existing** Google tag `AW-18004514734`. Do not install another Google tag or another Conversion Linker.

Until each action exists, it has no conversion label. Put the labels into the GTM tags (or into the import JSON, then re-import / edit) only after Ads creates them.

For all three, match `booked_call` if its windows differ from the defaults below. Otherwise use Google Ads’ usual website defaults: **30-day click-through**, **1-day view-through**, and the account default for engaged-view if the UI shows one.

All three should be **Secondary** (not Primary / not “account-default goal used for bidding”). Smart Bidding should keep optimizing on `booked_call`, which is the completed appointment. These three are funnel or intent signals; making them primary would pull bidding toward time-picks and clicks instead of booked calls.

Do not assign a conversion value (or set a fixed value of 0). A value here would inflate reported conversion value without representing a closed deal.

### 2.1 Booking time selected

- **Name:** `NEXA - Booking time selected`
- **Category:** Other — this is a mid-funnel step (a time was picked, the call was not booked). Leave **Book appointment** on `booked_call`.
- **Value:** Don’t use a value (or 0)
- **Count:** One — Calendly can fire this several times in one visit
- **Click-through window:** 30 days (match `booked_call` if different)
- **View-through window:** 1 day (match `booked_call` if different)
- **Primary or secondary:** **Secondary** — so Smart Bidding stays on booked calls, not on an unfinished calendar click
- **Label:** placeholder until Ads creates the action, then replace `PLACEHOLDER0bookingtime0`

### 2.2 Contact click (call or text)

- **Name:** `NEXA - Contact click`
- **Category:** Contact
- **Value:** Don’t use a value (or 0)
- **Count:** One — the same visit can click text, call, or the same link more than once
- **Click-through window:** 30 days (match `booked_call` if different)
- **View-through window:** 1 day (match `booked_call` if different)
- **Primary or secondary:** **Secondary** — contact taps are useful to watch, but they are not a booked conversation
- **Label:** placeholder until Ads creates the action, then replace `PLACEHOLDER0contactclick0`

### 2.3 NEXA application click

- **Name:** `NEXA - Application click`
- **Category:** Submit lead form — this is the click that starts the NEXA application in a new tab, not a confirmed submitted application. If you would rather describe the click itself, Outbound click is the more literal category.
- **Value:** Don’t use a value (or 0)
- **Count:** One — the link can be clicked repeatedly
- **Click-through window:** 30 days (match `booked_call` if different)
- **View-through window:** 1 day (match `booked_call` if different)
- **Primary or secondary:** **Secondary** — an application click is stronger intent than a time pick, but it is still not a booked call, and we do not currently measure a completed application
- **Label:** placeholder until Ads creates the action, then replace `PLACEHOLDER0application0`

---

## 3. GTM Custom Event triggers

No additional filters. Match the event name exactly (same pattern as the live `booked_call` trigger).

| Trigger name | Type | Event name | Filter |
| --- | --- | --- | --- |
| `CE - booking_time_selected` | Custom Event | `booking_time_selected` | Event name equals `booking_time_selected` |
| `CE - contact_click` | Custom Event | `contact_click` | Event name equals `contact_click` |
| `CE - application_click` | Custom Event | `application_click` | Event name equals `application_click` |

---

## 4. GTM Google Ads Conversion Tracking tags

Mirror the live booked_call tag (`__awct`, once per event, Conversion Linker on, event parameters on, custom parameters off, enhanced conversions off). Conversion ID is the same account tag. Labels stay placeholders until Andres sends the real ones.

| Tag name | Type | Conversion ID | Conversion label | Trigger | Firing option |
| --- | --- | --- | --- | --- | --- |
| `Google Ads Conversion - booking_time_selected` | Google Ads Conversion Tracking | `18004514734` (`AW-18004514734`) | `PLACEHOLDER0bookingtime0` until replaced | `CE - booking_time_selected` | Once per event |
| `Google Ads Conversion - contact_click` | Google Ads Conversion Tracking | `18004514734` (`AW-18004514734`) | `PLACEHOLDER0contactclick0` until replaced | `CE - contact_click` | Once per event |
| `Google Ads Conversion - application_click` | Google Ads Conversion Tracking | `18004514734` (`AW-18004514734`) | `PLACEHOLDER0application0` until replaced | `CE - application_click` | Once per event |

Shared tag settings (match the live booked_call conversion tag):

- Enable Conversion Linker: true (the container already has a Conversion Linker; leave that existing tag alone)
- Conversion value / currency / transaction ID: leave empty (GTM will send value 0)
- Enable event parameters: true (so `cta` and `method` can pass through when present)
- Enable custom parameters: false
- Enhanced conversions: off (same as booked_call)
- New customer / product / shipping reporting: off

Do not add a second Google tag, and do not edit the existing booked_call tag or Conversion Linker.

---

## 5. Importing the JSON (optional)

File: `docs/gtm-extra-conversions-import.json`.

It is a merge-only fragment: three triggers and three tags, no existing entities, modeled on the live version-3 `__awct` + Custom Event structure. Account and container numeric IDs are `0`; Tag Manager maps the file onto whichever container you import into. Import **only** into `GTM-KJ2N9SXK`.

1. In Tag Manager, open `GTM-KJ2N9SXK`.
2. Admin → Import Container → choose this JSON file.
3. Workspace: **New** (for example, “Extra Ads conversions — review”). Do not import into a workspace you might publish by accident.
4. Import option: **Merge**. For conflicts, **Rename** (do not overwrite). The preview should show **3 tags added, 3 triggers added, 0 deleted**. If anything would be deleted or the existing booked_call tag / Conversion Linker / Google tag would change, cancel.
5. Replace the three `PLACEHOLDER0…` labels with the real Ads labels before any publish.
6. Preview (section 6). Do **not** submit / publish until Andres approves.

If the import is rejected, build the six entities by hand from sections 3 and 4. An empty conversion label would cause GTM to refuse the file, which is why the placeholders are in a valid label shape (letters and digits only) instead of blank.

---

## 6. Preview / Tag Assistant test steps

Do this in GTM Preview (Tag Assistant) against https://nexavsretail.com, in the review workspace, **after** the tags exist. Completing a real Calendly booking is not required for these three events. Leave `booked_call` coverage as a sanity check only if you are willing to book or use a test event.

1. In GTM, click **Preview**, enter `https://nexavsretail.com`, and confirm Tag Assistant is connected.
2. **`booking_time_selected` (home):** scroll to `#apply`, wait for the inline calendar to load, pick a date and time, and stop before submitting the booking. In Tag Assistant, the event `booking_time_selected` should fire once for that selection, `cta` should be `apply_inline`, and `Google Ads Conversion - booking_time_selected` should fire. The booked_call tag should **not** fire.
3. **`booking_time_selected` (compare, optional):** open `/compare`, click “Talk to Andres”, pick a time in the modal, and stop. Expect `cta` of `compare_header` (or the matching CTA if you used another button). Same conversion tag; booked_call should not fire.
4. **Repeat selection:** in the same Calendly flow, go back and pick a different time. The dataLayer event will fire again. That is expected; Ads **Count: One** is what keeps one ad click from being counted twice.
5. **`contact_click`:** still on the home `#apply` section, click “Text 214-908-5914”. Expect event `contact_click` with `method: "sms"` and `Google Ads Conversion - contact_click`. Then click “call” and expect `method: "call"` and the same tag. These tags should not fire on `/privacy` (those tel/mailto links are untracked).
6. **`application_click`:** click “Start your NEXA application”. Expect event `application_click` and `Google Ads Conversion - application_click`. The destination is `https://loanofficersupport.com/r/Andres27520`; it is not a dataLayer field. Close the new tab.
7. **Negative checks:** navigate without clicking those elements; the three new tags should not fire on ordinary page views. Confirm the existing Google tag `AW-18004514734` and Conversion Linker still fire as they do today.
8. After real labels are in place, optionally confirm in Google Ads conversion diagnostics / Tag Assistant that the hits use `AW-18004514734/<real-label>` and not a `PLACEHOLDER0…` label.

Do not publish from Preview.

---

## 7. What Andres has to do himself

1. **Create the three conversion actions in Google Ads** (account `492-024-5566`): Goals → Conversions → New conversion action → Website. Use the Google tag that is already installed (`AW-18004514734`); do not add another tag snippet. Use the names, categories, value, count, windows, and Secondary setting in section 2.
2. **Send the three conversion labels** (the part after `AW-18004514734/` in each action’s “Use Google Tag Manager” tag setup) back in this chat, clearly labeled for booking time selected, contact click, and application click.
3. After the placeholders in GTM are replaced and Preview tests in section 6 pass, **approve a publish** of `GTM-KJ2N9SXK`. Nothing in this proposal should be published without that OK.

No site deploy is required for these conversions. Do not set `VITE_GOOGLE_ADS_ID` or the `VITE_ADS_LABEL_*` env vars; leaving them blank avoids double-counting.

---

## 8. Odd findings (no changes made)

- **Repeat fires are expected** for all three events. There is no once-per-session guard in site code. Use **Count: One** on the Ads actions.
- **`contact_click` has no email variant.** Only `sms` and `call`, and only on the home `#apply` section. Privacy-page email and phone links are untracked.
- **`application_click` does not include the destination URL** in the dataLayer; it only lives on the anchor `href`.
- **`booking_time_selected` has no `ADS_CONFIG.labels` entry** in `src/analytics.js`, unlike the other two. That is correct: it is sent with `trackEvent`, and GTM will own the conversion. Do not add a direct gtag label for it.
- **React `StrictMode`** wraps the app in `src/main.jsx`. Effect double-mounting happens in development only; the production listeners are not doubled, and home vs compare do not both listen at once.
- **The live Google tag `AW-18004514734` also contains an automatic conversion-marking rule** (compiled into `gtm.js`, not a tag Andres added for this site) that fires label `PnfrCPX_yIUcEK6vnIlD` on `page_view` of `unlockmyequityusa.com` (including a path that points at `axenmortgageheloc.com`). That URL will not match nexavsretail.com, so it should not record conversions here, but it suggests this Ads tag is shared with another property. Worth confirming that is intentional; this proposal does not change it.

---

## 9. Out of scope

- Publishing GTM or creating/editing anything in Google Ads or the live GTM workspace
- Filling `adsId` / `ga4Id` / labels in `src/analytics.js` or Vercel env vars
- Tracking email contact, privacy-page clicks, or a completed NEXA application
- Changing site event names, adding a destination parameter, or deduping events in code
