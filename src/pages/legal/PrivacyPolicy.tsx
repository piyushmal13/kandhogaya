import { LegalDocument } from "../../components/site/LegalDocument";

export const PrivacyPolicy = () => (
  <LegalDocument
    title="Privacy Policy"
    description="This Privacy Policy explains how IFX TRADES collects, uses, and protects information across the platform."
    path="/privacy"
    updated="March 2026"
  >
    <p>Welcome to IFX TRADES ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.</p>

    <section>
      <h2>1. Information We Collect</h2>
      <ul>
        <li>Identity and contact details such as name, email address, and phone number.</li>
        <li>Platform activity, onboarding information, and account interactions.</li>
        <li>Technical details such as browser type, IP address, device information, and diagnostics.</li>
      </ul>
    </section>

    <section>
      <h2>2. How We Use Information</h2>
      <ul>
        <li>Deliver and maintain the IFX TRADES platform and support workflows.</li>
        <li>Improve participant experience, product quality, and operational stability.</li>
        <li>Communicate product updates, security notices, and service-related messages.</li>
        <li>Monitor misuse, fraud, or behavior that could affect platform integrity.</li>
      </ul>
    </section>

    <section>
      <h2>3. Data Protection</h2>
      <p>We apply reasonable administrative and technical measures to protect information, but no online system can guarantee absolute security.</p>
    </section>

    <section>
      <h2>4. Contact</h2>
      <p>If you have privacy questions, contact <a href="mailto:support@ifxtrades.com">support@ifxtrades.com</a>.</p>
    </section>
  </LegalDocument>
);
