import { LegalDocument } from "../../components/site/LegalDocument";

export const TermsOfService = () => (
  <LegalDocument
    title="Terms of Service"
    description="These Terms of Service govern access to and use of the IFX TRADES platform, products, and educational resources."
    path="/terms"
    updated="March 2026"
  >
    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using IFX TRADES, you agree to these terms. If you do not agree, do not use the platform or services.</p>
    </section>

    <section>
      <h2>2. License of Use</h2>
      <p>Access is granted for lawful institutional or authorized business use. This is a limited license and not a transfer of ownership.</p>
      <ul>
        <li>You may not reproduce or redistribute protected materials without permission.</li>
        <li>You may not misuse platform access, automation, or restricted product content.</li>
        <li>You may not use the platform for unlawful or abusive conduct.</li>
      </ul>
    </section>

    <section>
      <h2>3. Service Nature</h2>
      <p>Educational content, execution models, and tools are provided on an "as available" basis. Availability, features, and workflows may change over time.</p>
    </section>

    <section>
      <h2>4. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, IFX TRADES is not liable for losses resulting from use of or inability to use the platform, including performance outcomes, interruptions, or third-party service failures.</p>
    </section>
  </LegalDocument>
);
