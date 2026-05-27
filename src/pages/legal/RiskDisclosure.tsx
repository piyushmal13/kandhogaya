import { LegalDocument } from "../../components/site/LegalDocument";

export const RiskDisclosure = () => (
  <LegalDocument
    title="Institutional Risk Disclosure & Algorithm Policy"
    description="This Risk Disclosure outlines the deep operational risks involved in trading leveraged algorithmic products, copy-trading latency deviations, and execution system parameters."
    path="/risk"
    updated="May 2026"
  >
    <section>
      <h2>1. General High-Leverage Risk Warning</h2>
      <blockquote>
        Trading foreign exchange, Contracts for Difference (CFDs), and systematic quantitative structures carries an extremely high level of risk. Algorithmic velocity, rapid execution dynamics, and significant financial leverage can result in substantial losses that may equal or exceed your entire initial capital deposits.
      </blockquote>
      <p>
        Before deploying any proprietary algorithmic model, custom portfolio setup, or trading strategy, you must carefully evaluate your investment objectives, financial experience level, and absolute tolerance for risk. Do not trade or commit capital that you cannot afford to completely lose.
      </p>
    </section>

    <section>
      <h2>2. Copy Trading & Signal Latency Deviations</h2>
      <p>
        IFX Trades facilitates advanced technical infrastructure, signal structures, and strategy copy configurations. Copy trading carries specialized operational risks:
      </p>
      <ul>
        <li><strong>Slippage & Timing Discrepancies:</strong> Signal distribution channels are subject to varying network latency. Orders executed at the master model source may be filled at different prices or under wider slippage parameters when copied to client brokerages.</li>
        <li><strong>System Differences:</strong> Differences in account sizes, leverage configurations, margin rules, and asset spreads at partnered brokerages can lead to significant execution deviations from the master model's performance metrics.</li>
        <li><strong>No Future Guarantees:</strong> Past systematic historical performance, simulated backtests, and high-frequency model feeds do not guarantee future performance or risk mitigation.</li>
      </ul>
    </section>

    <section>
      <h2>3. Technology, Bridge & Network Execution Risks</h2>
      <p>
        Systematic high-frequency operations rely heavily on internet connections, hardware setups, socket layers, and API bridge protocols (including MT4/MT5, FIX 4.4, and custom API tunnels). IFX Trades and its partners do not assume any liability for trade losses, missed execution fills, or margin liquidations resulting from:
      </p>
      <ul>
        <li>Internet connectivity interruptions, server hardware downtime, or socket communication dropouts.</li>
        <li>Latency lag, queue backlog, or execution bridge failures in third-party MT4/MT5 terminal systems.</li>
        <li>Incorrect margin settings, custom leverage parameter mismatches, or platform update latency on client-side software.</li>
      </ul>
    </section>

    <section>
      <h2>4. Absolutely No Financial or Investment Advice</h2>
      <p>
        All information, algorithmic indicators, historical performance feeds, webinars, and educational documentations provided by IFX Trades are strictly for informational and educational purposes.
      </p>
      <p>
        IFX Trades is a financial technology software provider. We do not accept client trading deposits, manage client investment funds, or act as an authorized financial advisor. Every trade execution deployed through our systems is performed at the sole responsibility and discretion of the account holder.
      </p>
    </section>
  </LegalDocument>
);
