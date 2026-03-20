import { LegalDocument } from "../../components/site/LegalDocument";

export const CookiePolicy = () => (
  <LegalDocument
    title="Cookie Policy"
    description="This Cookie Policy describes how IFXTrades uses cookies and similar technologies across the website and platform."
    path="/cookies"
    updated="March 2026"
  >
    <section>
      <h2>1. What Cookies Are</h2>
      <p>Cookies are small text files stored on your device to support website functionality, preferences, analytics, and security.</p>
    </section>

    <section>
      <h2>2. How We Use Cookies</h2>
      <ul>
        <li>Essential cookies to keep the platform functional and secure.</li>
        <li>Analytics cookies to understand how the site is used and where it can be improved.</li>
        <li>Preference cookies to remember non-sensitive user choices.</li>
      </ul>
    </section>

    <section>
      <h2>3. Managing Cookies</h2>
      <p>You can usually control cookies through browser settings, although disabling them may reduce website functionality or personalization.</p>
    </section>

    <section>
      <h2>4. Policy Updates</h2>
      <p>We may revise this policy from time to time as platform behavior, legal requirements, or analytics tooling changes.</p>
    </section>
  </LegalDocument>
);
