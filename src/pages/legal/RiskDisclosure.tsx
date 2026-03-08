import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const RiskDisclosure = () => {
  return (
    <div className="bg-[#020202] min-h-screen text-gray-300 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-8">Risk Disclosure</h1>
        <div className="prose prose-invert prose-emerald max-w-none">
          <p className="text-sm text-gray-500 mb-8">Last Updated: October 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. General Risk Warning</h2>
            <p className="border-l-4 border-red-500 pl-4 py-2 bg-red-500/10 rounded-r-lg">
              Trading foreign exchange (Forex) and Contracts for Difference (CFDs) on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange, you should carefully consider your investment objectives, level of experience, and risk appetite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Market Volatility</h2>
            <p>
              The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with foreign exchange trading and seek advice from an independent financial advisor if you have any doubts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Technology Risk</h2>
            <p>
              Internet-based trading systems involve risks including, but not limited to, the failure of hardware, software, and Internet connection. Since IFXTrades does not control signal power, its reception or routing via Internet, configuration of your equipment or reliability of its connection, we cannot be responsible for communication failures, distortions or delays when trading via the Internet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. No Financial Advice</h2>
            <p>
              The information provided on this website is for educational purposes only and does not constitute investment advice, financial advice, trading advice, or any other sort of advice. You should not treat any of the website's content as such. IFXTrades does not recommend that any cryptocurrency or forex pair should be bought, sold, or held by you.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
