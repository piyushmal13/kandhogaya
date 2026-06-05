import { LegalDocument } from "../../components/site/LegalDocument";

export const TermsOfService = () => (
  <LegalDocument
    title="Terms of Service"
    description="These Terms of Service govern access to and use of the IFXTrades platform, quantitative products, algorithmic software licensing, and educational resources."
    path="/terms"
    updated="June 2026"
  >
    <section>
      <h2>1. Acceptance of Terms & Corporate Legal Status</h2>
      <p>
        By accessing or using the IFXTrades platform, purchasing software licenses, or consuming our educational materials, you agree to be legally bound by these Terms of Service. If you do not agree, you are prohibited from using our services.
      </p>
      <p>
        <strong>Sovereign Software Developer Status:</strong> IFXTrades operates strictly as a quantitative software development desk. We do not function as a financial broker, dealer, custodian, asset manager, or investment advisor. We do not manage retail client funds, accept trading deposits, or offer authorized financial advice. All software, indicators, templates, and signals are provided for technical execution and educational research purposes only.
      </p>
    </section>

    <section>
      <h2>2. Permitted Jurisdictions & User Representations</h2>
      <p>
        By accessing our platform and services, you represent and warrant that:
      </p>
      <ul>
        <li>You are of legal age (at least 18 years old or the age of majority in your jurisdiction) and possess full capacity to execute binding contracts.</li>
        <li>You do not reside in, and are not a citizen of, any jurisdiction where the distribution or use of retail forex signals, algorithmic bots, or Contract for Difference (CFD) products is prohibited by local law or regulation (including, but not limited to, the United States of America).</li>
        <li>You will not use the platform or compiled binaries for any unlawful, manipulative, or abusive execution practices.</li>
      </ul>
    </section>

    <section>
      <h2>3. Algorithmic Software Licensing & Environment Binding</h2>
      <p>
        All quantitative models, algorithmic bots, execution bridges, and indicator binaries purchased or licensed from IFXTrades are subject to a limited, non-transferable, revocable license:
      </p>
      <ul>
        <li><strong>Hardware & IP Binding:</strong> To prevent unauthorized redistribution and piracy, licensed binaries are strictly bound to a single virtual private server (VPS) IP address or Hardware ID (HWID Lock).</li>
        <li><strong>Anti-Piracy Covenants:</strong> You agree not to reverse-engineer, decompile, duplicate, rent, lease, or redistribute any licensed files.</li>
        <li><strong>Automatic Blacklisting:</strong> If concurrent execution requests or duplicate IP queries are detected on a single license key, our security layer will automatically and permanently blacklist the license key without refund or notice.</li>
      </ul>
    </section>

    <section>
      <h2>4. Systematic Trading & High-Leverage Risks (CFDs)</h2>
      <p>
        You acknowledge that Contracts for Difference (CFDs) and leveraged forex products are highly volatile financial instruments. Leveraging means that minor price movements can lead to rapid capital depletion, margin calls, or total account liquidation.
      </p>
      <p>
        <strong>Absolute Risk Allocation:</strong> The deployment and runtime operation of any quantitative model or algorithm are performed at your sole risk and discretion. You are solely responsible for setting appropriate risk settings, maximum drawdown limits, position sizes, and monitoring broker execution parameters. Past performance, backtesting telemetry, and simulated stats do not guarantee future returns.
      </p>
    </section>

    <section>
      <h2>5. Absolute Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, IFXTrades, its developers, quants, directors, and affiliates shall not be liable for any direct, indirect, incidental, or consequential losses, including but not limited to:
      </p>
      <ul>
        <li>Trading losses, account drawdowns, margin calls, or total account deactivations.</li>
        <li>Execution failures, order slippage, price feed latency, or broker execution mismatches.</li>
        <li>API connection disconnections, network outages, VPS downtime, socket errors, or software runtime bugs.</li>
        <li>Loss of profits, loss of data, or business disruptions arising from platform usage.</li>
      </ul>
      <p>
        Our maximum aggregate liability for any claim arising out of these terms or platform usage shall be strictly limited to the actual amount paid by you to IFXTrades for the service or license in the twelve (12) months preceding the event giving rise to such liability.
      </p>
    </section>

    <section>
      <h2>6. Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless IFXTrades, its officers, developers, quants, and agents from and against any and all claims, liabilities, damages, losses, or regulatory actions arising from your breach of these terms, your use of our software in live trading environments, or your execution of high-risk CFD operations.
      </p>
    </section>

    <section>
      <h2>7. Governing Law & Jurisdictional Venue</h2>
      <p>
        These Terms of Service and any dispute arising out of or in connection with them shall be governed by and construed in accordance with the laws of the United Arab Emirates (Dubai) or India, without giving effect to any principles of conflicts of law. You agree that any legal action or arbitration arising out of these terms shall be filed exclusively in the courts or arbitration tribunals located in Dubai, UAE, or Mumbai, India.
      </p>
    </section>

    <section>
      <h2>8. Kingdom of Thailand Specific Regulatory Disclaimers</h2>
      <p>
        If you are accessing the platform, signals, or custom quantitative software from the Kingdom of Thailand, you acknowledge and agree that:
      </p>
      <ul>
        <li>IFXTrades operates strictly as an offshore technological software developer and researcher. We do not hold a license from the Securities and Exchange Commission of Thailand (Thai SEC) or the Bank of Thailand (BOT).</li>
        <li>No services, bots, compiled models, or signals constitute the solicitation, brokerage, advising, or facilitation of regulated securities or derivatives transactions inside Thailand under the Securities and Exchange Act B.E. 2535.</li>
        <li>Thai residents executing trades on offshore accounts using our software represent that they do so at their own risk, in full compliance with BOT foreign exchange regulations under the Emergency Decree on Foreign Exchange B.E. 2485.</li>
      </ul>
    </section>

    <section className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
      <h3 className="text-red-500 font-bold uppercase text-xs mb-2">Allocator Risk and Liability Agreement</h3>
      <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
        RISK IS 100% AT THE CLIENT'S END. IFX TRADES OPERATES ONLY AS A TECHNICAL SOFTWARE INFRASTRUCTURE PROVIDER. THE COMPANY IS NOT RESPONSIBLE OR LIABLE FOR TERMINAL DRAWDOWN EXHAUSTION, MARGIN LOSSES, OR ACCOUNT DEACTIVATION OCCURRED DURING EVALUATION CHALLENGES OR FUNDED OPERATIONS.
      </p>
    </section>
  </LegalDocument>
);
