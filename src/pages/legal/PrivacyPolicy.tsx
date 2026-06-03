import { LegalDocument } from "../../components/site/LegalDocument";

export const PrivacyPolicy = () => (
  <LegalDocument
    title="Privacy Policy"
    description="This Privacy Policy explains how IFXTrades collects, uses, and protects information across the platform."
    path="/privacy"
    updated="March 2026"
  >
    <p>Welcome to IFXTrades ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.</p>

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
        <li>Deliver and maintain the IFXTrades platform and support workflows.</li>
        <li>Improve trader experience, product quality, and operational stability.</li>
        <li>Communicate product updates, security notices, and service-related messages.</li>
        <li>Monitor misuse, fraud, or behavior that could affect platform integrity.</li>
      </ul>
    </section>

    <section>
      <h2>3. Data Protection</h2>
      <p>We apply reasonable administrative and technical measures to protect information, but no online system can guarantee absolute security.</p>
    </section>

    <section>
      <h2>4. Institutional Compliance & Allocator KYC</h2>
      <p>
        In accordance with ECN brokerage agreements and prop firm challenge verification protocols, users seeking quantitative signal access keys must complete identity validation (KYC) and execute signature bindings. The metadata retrieved is held in encrypted structures to comply with institutional anti-fraud regulations.
      </p>
    </section>

    <section className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
      <h3 className="text-red-400 font-bold uppercase text-xs mb-2">Mandatory Risk and Liability Decree</h3>
      <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
        RISK IS 100% AT THE CLIENT'S END. IFX TRADES OPERATES ENTIRELY AS A SOFTWARE INFRASTRUCTURE PROVIDER. THE COMPANY IS NOT RESPONSIBLE OR LIABLE FOR ANY CAPITAL DEVIATION, POSITION SLIPPAGE, BROKER LIQUIDATION, OR DRAWDOWN LIMIT BREACHES OCCURRED DURING PLATFORM OR BINARY USAGE.
      </p>
    </section>

    <section>
      <h2>5. Contact</h2>
      <p>If you have privacy questions, contact <a href="mailto:support@ifxtrades.com">support@ifxtrades.com</a>.</p>
    </section>
  </LegalDocument>
);
