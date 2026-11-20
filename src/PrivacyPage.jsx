import { CompareLayout } from "./compare/Layout.jsx"

export const PRIVACY_UPDATED = "November 20, 2026"

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 space-y-3 leading-7 text-slate-600">{children}</div>
    </section>
  )
}

export function PrivacyPage() {
  return (
    <CompareLayout crumbs={[{ name: "Home", href: "/" }, { name: "Privacy policy", href: "/privacy" }]}>
      <article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated {PRIVACY_UPDATED}</p>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This site (nexavsretail.com) is run by Andres Aviles, a loan officer with NEXA Lending (NMLS #2640511), to help
          mortgage professionals learn about the NEXA model and book a conversation. This page explains what information
          the site collects and how it's used.
        </p>

        <Section title="Information you give us">
          <p>
            When you book a call, you may enter your name, email, current company, and goals. Those details pre-fill the
            booking calendar, which is run by Calendly. Your booking (and anything you type into Calendly) is handled under{" "}
            <a href="https://calendly.com/privacy" target="_blank" rel="noreferrer" className="underline">Calendly's privacy policy</a>.
          </p>
          <p>
            If you text, call, or email Andres, he'll receive whatever you choose to share. If you use the AI comparison
            tool, the company name you enter is sent to an AI service to generate the comparison; please don't enter
            personal information there.
          </p>
        </Section>

        <Section title="Information collected automatically">
          <p>
            Like most websites, this site may use Google Analytics and Google Ads, which use cookies and similar
            technology to understand how visitors use the site and to measure whether ads lead to booked calls. This can
            include your device and browser type, pages visited, approximate location, and the ad or link that brought
            you here (for example, campaign tags).
          </p>
          <p>
            Google Ads may also be used to show ads about this opportunity to people who have visited the site
            (remarketing). You can control ad personalization at{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="underline">Google's Ad Settings</a>,
            learn how Google uses data at{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer" className="underline">
              policies.google.com/technologies/partner-sites
            </a>
            , and opt out of Google Analytics with the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="underline">browser add-on</a>.
          </p>
        </Section>

        <Section title="How the information is used">
          <p>
            To schedule and prepare for your conversation, follow up with you about it, answer your questions, and
            improve the site and its advertising. Your information is not sold.
          </p>
        </Section>

        <Section title="Sharing">
          <p>
            Information is shared only with the service providers that run the site and its tools (such as Calendly,
            Google, and the site's hosting provider), with NEXA Lending if you choose to move forward, or when required
            by law.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask to see, correct, or delete the information you've shared, or ask not to be contacted again, by
            emailing <a href="mailto:loans@andresaviles.com" className="underline">loans@andresaviles.com</a> or
            calling <a href="tel:+12149085914" className="underline">214-908-5914</a>. You can also block or delete
            cookies in your browser settings.
          </p>
        </Section>

        <Section title="Who this site is for">
          <p>
            This site is for mortgage professionals and isn't directed to children under 13. It is not an offer to lend
            or a commitment to hire.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Andres Aviles, Loan Officer, NEXA Lending · NMLS #2640511
            <br />
            <a href="mailto:loans@andresaviles.com" className="underline">loans@andresaviles.com</a> ·{" "}
            <a href="tel:+12149085914" className="underline">214-908-5914</a>
          </p>
        </Section>
      </article>
    </CompareLayout>
  )
}
