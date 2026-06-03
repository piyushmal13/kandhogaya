import { LegalDocument } from "../../components/site/LegalDocument";

export const RiskDisclosure = () => (
  <LegalDocument
    title="Institutional Risk Disclosure & Algorithm Policy"
    description="This Risk Disclosure outlines the core operational risks involved in trading leveraged algorithmic products, copy-trading latency deviations, and execution system parameters."
    path="/risk"
    updated="May 2026"
  >
    <section>
      <h2>1. High-Leverage Margin Exposure & Capital Loss</h2>
      <blockquote>
        Systematic trading of foreign exchange (FX) contracts, Contracts for Difference (CFDs), and leveraged derivatives involves profound financial risk. Execution velocity, sudden liquidity voids, and institutional leverage (up to 1:500 or higher) amplify both profits and losses. Exposure under high leverage can result in rapid, complete liquidation of all committed capital.
      </blockquote>
      <p>
        Prior to deploying any quantitative strategy, commercial algorithm, or custom model, you must conduct a thorough audit of your financial capacity and risk tolerance. Never commit capital that you cannot afford to lose entirely.
      </p>
    </section>

    <section>
      <h2>2. Copy-Trading Latency & Execution Drift</h2>
      <p>
        IFX Trades provides technical infrastructure, signal routing bridges, and automated strategy copy systems. Clients using these copy-trading protocols must acknowledge several critical parameters:
      </p>
      <ul>
        <li><strong>Slippage & Latency Drift:</strong> Trade distribution networks are subject to millisecond latency variations. Orders executed at the master model source may experience price slippage when mirrored in client brokerage accounts.</li>
        <li><strong>Execution Discrepancies:</strong> Variations in account sizing, margin constraints, leverage limits, and broker-specific spread markups can cause significant performance divergence between the client account and the master model.</li>
        <li><strong>Historical Performance Limitations:</strong> Past systematic backtesting, audited tracking histories, and high-frequency model feeds do not guarantee future returns or market-neutral safety.</li>
      </ul>
    </section>

    <section>
      <h2>3. VPS Server Allocation & Liquidation Floor</h2>
      <p>
        To preserve capital and protect accounts from extreme latency drift during high-volatility events, specific account equity limits govern the deployment of complimentary VPS hosting:
      </p>
      <ul>
        <li><strong>Equity Qualification Threshold:</strong> A minimum equity balance of <strong>$1,000 USD</strong> (or institutional currency equivalent) must be maintained in the connected partnered brokerage account at all times.</li>
        <li><strong>Automated Safeguard Disconnection:</strong> In the event that the account equity falls below the $1,000 USD margin floor, the automated bridge compliance system will instantly suspend the execution socket. This disconnection prevents catastrophic margin calls and liquidation due to latency mismatches or insufficient free margin during drawdowns.</li>
        <li><strong>Co-Location Specs:</strong> All active algorithmic servers operate under a strict sub-5ms co-location standard to primary liquidity hubs (LD4, NY4). Suspending connections below the threshold protects the integrity of both the client account and the signal bridge.</li>
      </ul>
    </section>

    <section>
      <h2>4. Intellectual Property & Hardware ID (HWID) Locks</h2>
      <p>
        All commercial algorithms, proprietary indicators, and C++ or Python execution binaries developed by IFX Trades are protected under strict intellectual property frameworks.
      </p>
      <ul>
        <li><strong>Hardware ID Binding:</strong> Every licensed copy of an algorithm (such as the QuantX series) is locked to a specific MAC Address, Motherboard UUID, or virtual environment IP address (HWID Lock).</li>
        <li><strong>Multi-Machine Protection:</strong> Running a single license key on multiple terminals, parallel VPS servers, or virtual devices is strictly prohibited.</li>
        <li><strong>Automatic Blacklisting:</strong> The license server performs continuous verification. If duplicate HWID requests are detected on the same license key, the key is permanently blacklisted, and access is revoked without refund or appeal.</li>
      </ul>
    </section>

    <section>
      <h2>5. Technology, Socket & Bridge Execution Risks</h2>
      <p>
        High-velocity automated operations rely heavily on stable network infrastructure, socket layers, and API bridge protocols (including MT4, MT5, and FIX 4.4 connections). IFX Trades accepts no liability for trade execution delays, missing fills, or margin stops caused by:
      </p>
      <ul>
        <li>Network dropouts, server hardware failures, or socket communication interruptions.</li>
        <li>Third-party platform updates, bridge bridge-terminal lag, or API routing errors.</li>
        <li>Improper client-side margin limits or leverage parameter settings.</li>
      </ul>
    </section>

    <section>
      <h2>6. Zero Advisory Status</h2>
      <p>
        IFX Trades is a financial technology software provider. We do not manage retail client funds, accept trading deposits, or offer authorized investment or financial advisory services. All analytical software, indicators, webinars, and educational documentation are provided for research purposes only. Each trade execution is made at the sole risk and discretion of the account holder.
      </p>
    </section>

    <section>
      <h2>7. Proprietary (Prop) Firm Operations & Agreement Signing</h2>
      <p>
        Allocators and traders using quantitative signal copy-bridges on proprietary firm accounts (e.g., FTMO, FundedNext, Alpha Capital) must comply with strict evaluation guidelines. Standard commercial EAs frequently trigger violations due to IP address geolocation conflicts, consistency margin rules, or HFT toxic flow patterns.
      </p>
      <ul>
        <li><strong>Consistency Rules & Position Sizes:</strong> Built-in position sizing models adjust exposures dynamically using real-time Average True Range metrics, preventing consistency rule flags.</li>
        <li><strong>IP/HWID Lock Validation:</strong> Each generated binary is bound to a single virtual environment IP (HWID Lock), shielding the account from multi-login IP address discrepancies.</li>
        <li><strong>Contract Execution & Identity verification:</strong> Prior to signal bridge activation, clients are required to pass identity checks (KYC) and sign the digital SLA agreement confirming sole control of credentials.</li>
      </ul>
    </section>

    <section className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
      <h3 className="text-red-500 font-bold uppercase text-xs mb-2">Absolute Client Risk Statement</h3>
      <p class="text-[11px] text-gray-400 font-mono leading-relaxed">
        CLIENT ABSOLUTE RISK STATEMENT: ALL SYSTEMATIC TRADING RISK RESTS 100% AT THE CLIENT'S END. IFX TRADES OPERATES SOLELY AS A SOFTWARE TECHNOLOGY PROVIDER. THE COMPANY IS NOT AN AUTHORIZED ADVISOR OR BROKER-DEALER, AND IS NOWHERE RESPONSIBLE OR LIABLE FOR ANY CAPITAL LOSS, MARGIN EXHAUSTION, ACCOUNT LIQUIDATION, OR SLIPPAGE OCCURRED DURING PLATFORM USAGE.
      </p>
    </section>
  </LegalDocument>
);
