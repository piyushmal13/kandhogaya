import { LegalDocument } from "../../components/site/LegalDocument";

export const PrivacyPolicy = () => (
  <LegalDocument
    title="Privacy Policy"
    description="This Privacy Policy explains how IFXTrades collects, uses, and protects personal, operational, and system configuration data across our platform and quantitative tools."
    path="/privacy"
    updated="June 2026"
  >
    <p>Welcome to IFXTrades. We are committed to protecting your personal information and your right to privacy in accordance with international security standards.</p>

    <section>
      <h2>1. Information We Collect</h2>
      <p>We collect personal and technical information to ensure secure license validation, verify billing compliance, and enhance platform experience:</p>
      <ul>
        <li><strong>Identity & Contact Data:</strong> Name, verified email address, phone number, geographical location, and trading experience metrics.</li>
        <li><strong>System & Environment Diagnostics:</strong> Hardware IDs (HWID), virtual environment properties, VPS IP addresses, browser cookies, and platform logs to validate execution licenses.</li>
        <li><strong>Fulfillment Screenshots:</strong> Screenshots and payment verification details uploaded manually by clients to authorize subscription access.</li>
      </ul>
    </section>

    <section>
      <h2>2. How We Use and Process Your Information</h2>
      <p>Your details are used strictly under the following scopes:</p>
      <ul>
        <li>To validate and verify single-user license keys on MetaTrader 5 (MT5), MT4, or custom API endpoints.</li>
        <li>To track and analyze systematic execution performance logs for server optimization.</li>
        <li>To prevent fraudulent registration, copy-trading redistribution, or account duplication.</li>
        <li>To communicate product updates, security advisories, and service updates.</li>
      </ul>
    </section>

    <section>
      <h2>3. Data Protection and Encryption</h2>
      <p>
        All collected personal and system data is stored in high-security databases managed by Supabase, protected by Row-Level Security (RLS) policies and standard database encryption. We apply advanced security practices to prevent unauthorized access, but no system can guarantee absolute safety.
      </p>
    </section>

    <section>
      <h2>4. Institutional Compliance & Allocator KYC</h2>
      <p>
        In accordance with brokerage agreements, ECN routing requirements, and prop-firm evaluation guidelines, users seeking quantitative signal access keys must complete identity validation (KYC) and execute signature bindings. The metadata retrieved is held in encrypted structures to comply with institutional anti-fraud regulations.
      </p>
    </section>

    <section>
      <h2>5. Sharing Data with Third Parties</h2>
      <p>
        We do not sell, rent, or lease client information to third parties. Data is shared only with officially partnered brokerages or execution platforms to coordinate client-side VPS setups and account mappings under active promotional programs.
      </p>
    </section>

    <section>
      <h2>6. Contact & Legal Requests</h2>
      <p>If you have any questions regarding your data, your rights, or this Privacy Policy, please reach out to <a href="mailto:support@ifxtrades.com">support@ifxtrades.com</a>.</p>
    </section>

    <section className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
      <h3 className="text-red-400 font-bold uppercase text-xs mb-2">Mandatory Risk and Liability Decree</h3>
      <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
        RISK IS 100% AT THE CLIENT'S END. IFX TRADES OPERATES ENTIRELY AS A SOFTWARE INFRASTRUCTURE PROVIDER. THE COMPANY IS NOT RESPONSIBLE OR LIABLE FOR ANY CAPITAL DEVIATION, POSITION SLIPPAGE, BROKER LIQUIDATION, OR DRAWDOWN LIMIT BREACHES OCCURRED DURING PLATFORM OR BINARY USAGE.
      </p>
    </section>
  </LegalDocument>
);
