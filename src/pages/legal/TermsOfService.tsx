import { LegalDocument } from "../../components/site/LegalDocument";

export const TermsOfService = () => (
  <LegalDocument
    title="Terms of Service"
    description="These Terms of Service govern access to and use of the IFXTrades platform, products, and educational resources."
    path="/terms"
    updated="March 2026"
  >
    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using IFXTrades, you agree to these terms. If you do not agree, do not use the platform or services.</p>
    </section>

    <section>
      <h2>2. License of Use</h2>
      <p>Access is granted for lawful personal or authorized business use. This is a limited license and not a transfer of ownership.</p>
      <ul>
        <li>You may not reproduce or redistribute protected materials without permission.</li>
        <li>You may not misuse platform access, automation, or restricted product content.</li>
        <li>You may not use the platform for unlawful or abusive conduct.</li>
      </ul>
    </section>

    <section>
      <h2>3. Service Nature</h2>
      <p>Educational content, signals, and tools are provided on an "as available" basis. Availability, features, and workflows may change over time.</p>
    </section>

    <section>
      <h2>4. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, IFXTrades is not liable for losses resulting from use of or inability to use the platform, including trading outcomes, interruptions, or third-party service failures.</p>
    </section>

    <section>
      <h2>5. Promotional Campaigns & VPS Hosting ("Promo")</h2>
      <p>Under active promotional offers (the "Promo"), eligible systematic users may qualify for a complimentary ultra-low latency VPS hosting server setup. The following conditions govern eligibility under the Promo:</p>
      <ul>
        <li>The client must open and maintain a fully funded active trading account with one of our officially partnered B2B brokerages.</li>
        <li>The minimum capital balance maintained in the partnered trading account must exceed $1,000 USD at all times.</li>
        <li>Compromising account integrity, fraudulent referrals, or failing to maintain the minimum balance will result in immediate termination of the complimentary VPS hosting server.</li>
        <li>The Promo is subject to availability and may be modified, suspended, or terminated at any time at the platform's sole discretion without prior notice.</li>
      </ul>
    </section>

    <section>
      <h2>6. Proprietary (Prop) Firm Operations</h2>
      <p>
        Systematic execution bridges and socket layers connecting to third-party proprietary trading firms (evaluation accounts or funded allocations) must operate strictly in compliance with prop firm guidelines. Client-side identity parameter checks (KYC) and formal SLA contract signing must be completed prior to license key activation.
      </p>
    </section>

    <section className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
      <h3 className="text-red-500 font-bold uppercase text-xs mb-2">Allocator Risk and Liability Agreement</h3>
      <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
        RISK IS 100% AT THE CLIENT'S END. IFX TRADES OPERATES ONLY AS A TECHNICAL SOFTWARE INFRASTRUCTURE PROVIDER. THE COMPANY IS NOT RESPONSIBLE OR LIABLE FOR TERMINAL DRAWDOWN EXHAUSTION, MARGIN LOSSES, OR ACCOUNT DEACTIVATION OCCURRED DURING EVALUATION CHALLENGES OR FUNDED OPERATIONS.
      </p>
    </section>
  </LegalDocument>
);
