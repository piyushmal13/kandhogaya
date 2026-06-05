import { LegalDocument } from "../../components/site/LegalDocument";

export const RiskDisclosure = () => (
  <LegalDocument
    title="Institutional Risk Disclosure & Software Agreement"
    description="This document governs the operational scope of IFXTrades, detailing leverage risks, algorithmic execution risks, licensing limits, and client risk attribution."
    path="/risk"
    updated="June 2026"
  >
    <section>
      <h2>Clause 1: Corporate Status & Software Development Scope</h2>
      <blockquote>
        IFXTrades operates strictly as a quantitative software development laboratory. We design, compile, and configure customized automated trading bots and indicators for clients based on their unique project specifications and parameters.
      </blockquote>
      <p>
        Our services are purely technical. We do not hold client funds, manage accounts, or act as an authorized financial advisor or broker-dealer.
      </p>
    </section>

    <section>
      <h2>Clause 2: Leverage and CFD High-Risk Warning</h2>
      <p>
        Trading Contracts for Difference (CFDs) on margin carries a high level of risk and may not be suitable for all investors. Leveraged products amplify both gains and losses:
      </p>
      <ul>
        <li><strong>Rapid Capital Depletion:</strong> High leverage can cause you to lose your entire trading balance within seconds or minutes in volatile market conditions.</li>
        <li><strong>Margin Calls and Liquidation:</strong> If your account equity falls below the broker's margin requirements, your positions will be automatically liquidated (stopped out), and you will suffer permanent capital loss.</li>
        <li><strong>No Capital Guarantees:</strong> You should never trade with capital you cannot afford to lose. There is zero guarantee that any trading system, indicator, or automated bot will generate profit or avoid drawdown.</li>
      </ul>
    </section>

    <section>
      <h2>Clause 3: Algorithmic and Systematic Execution Risks</h2>
      <p>
        Automated and systematic trading algorithms depend heavily on technological infrastructure and server connectivity. By deploying our software, you acknowledge the following inherent risks:
      </p>
      <ul>
        <li><strong>Execution Lags & Slippage:</strong> Market volatility, broker routing latency, and server delays can cause orders to be filled at prices significantly different from those expected (slippage).</li>
        <li><strong>Code and Loop Anomalies:</strong> Algorithmic systems are subject to bugs, execution conflicts, or loops where trades may execute repeatedly. Extreme spreads or abnormal broker data feeds can trigger unintended position sizing.</li>
        <li><strong>Infrastructure Outages:</strong> VPS server downtime, broker API disconnects, internet latency, and socket errors can block algorithm execution or prevent stop-loss orders from triggering.</li>
      </ul>
    </section>

    <section>
      <h2>Clause 4: Zero Advisory & No Fiduciary Relationship</h2>
      <p>
        All indicators, charts, webinars, signals, and code files are provided for research, testing, and execution optimization purposes. IFXTrades does not provide investment, trading, or financial advice. Every live trade execution is made at the sole risk and discretion of the account holder.
      </p>
    </section>

    <section>
      <h2>Clause 5: Hardware binding & HWID Locks</h2>
      <p>
        To prevent pirated redistribution, licensed binaries are bound to specific virtual environments:
      </p>
      <ul>
        <li><strong>IP & HWID Binding:</strong> Every licensed bot is bound to a single virtual private server IP address or Hardware ID (HWID Lock).</li>
        <li><strong>Duplicate Prevention:</strong> If duplicate execution requests are detected on the same license key across multiple IPs, the key is automatically blacklisted.</li>
      </ul>
    </section>

    <section className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
      <h3 className="text-red-500 font-bold uppercase text-xs mb-2">Absolute Client Risk Statement</h3>
      <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
        CLIENT ABSOLUTE RISK STATEMENT: ALL SYSTEMATIC TRADING RISK RESTS 100% AT THE CLIENT'S END. IFX TRADES OPERATES SOLELY AS A SOFTWARE TECHNOLOGY PROVIDER. THE COMPANY IS NOT AN AUTHORIZED ADVISOR OR BROKER-DEALER, AND IS NOWHERE RESPONSIBLE OR LIABLE FOR ANY CAPITAL LOSS, MARGIN EXHAUSTION, ACCOUNT LIQUIDATION, OR SLIPPAGE OCCURRED DURING PLATFORM USAGE.
      </p>
    </section>
  </LegalDocument>
);
