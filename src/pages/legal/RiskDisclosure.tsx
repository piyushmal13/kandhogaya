import { LegalDocument } from "../../components/site/LegalDocument";

export const RiskDisclosure = () => (
  <LegalDocument
    title="Risk Disclosure"
    description="This Risk Disclosure outlines the key risks involved in trading leveraged financial products and using educational trading services."
    path="/risk"
    updated="March 2026"
  >
    <section>
      <h2>1. General Risk Warning</h2>
      <blockquote>
        Trading foreign exchange, CFDs, and similar leveraged instruments carries a high level of risk and may not be suitable for all investors.
      </blockquote>
    </section>

    <section>
      <h2>2. Market Volatility</h2>
      <p>Fast-moving markets can create slippage, price gaps, and losses beyond expected short-term ranges. You should only trade capital you can afford to risk.</p>
    </section>

    <section>
      <h2>3. Technology Risk</h2>
      <p>Internet connectivity, software, device configuration, and third-party service interruptions may affect signal delivery, execution timing, or platform access.</p>
    </section>

    <section>
      <h2>4. No Financial Advice</h2>
      <p>Information provided by IFXTrades is for educational and informational purposes. It does not constitute investment advice or a recommendation to buy, sell, or hold any instrument.</p>
    </section>
  </LegalDocument>
);
