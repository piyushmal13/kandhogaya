import React from "react";
import { Link } from "react-router-dom";
import { Server, Zap, ShieldCheck, Cpu, ArrowRight, TableProperties, Network, Workflow } from "lucide-react";
import { PageMeta } from "../components/site/PageMeta";

/**
 * MT4/MT5 Execution Bridging Landing Page (v1.0)
 * 
 * High-performance, institutional technical showcase for execution bridges.
 * Optimized for standard SEO crawlers and Generative Engine Optimization (GEO).
 */
export const MT4MT5Bridge = () => {
  return (
    <main className="min-h-screen bg-[#010203] text-white selection:bg-[#58F2B6] selection:text-black pt-36 pb-24 relative overflow-hidden">
      <PageMeta
        title="MT4/MT5 Execution Bridging | Equinix NY4 Co-Location"
        description="Deploy B2B institutional execution bridges co-located in Equinix NY4/LD4 hubs. Ultra-low latency FIX API routing with Smart Order Routing (SOR) and sub-millisecond sync."
        path="/solutions/bridge"
        keywords={[
          "MT4 MT5 bridging",
          "Equinix NY4 cross-connection",
          "FIX API engine alignment",
          "smart order routing SOR",
          "sub-millisecond latency profiling",
          "broker execution bridges",
          "institutional liquidity hub"
        ]}
      />

      {/* Ambient glowing background grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
        <div className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Block */}
        <header className="text-center max-w-4xl mx-auto mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em]">
            <Server className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            Co-Located Sub-Millisecond Telemetry
          </div>
          <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight leading-none italic">
            Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Execution Bridges</span>.
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Power your brokerage or fund with IFX Trades proprietary execution bridges. Co-located inside the Equinix NY4 (New York) and LD4 (London) financial data hubs for absolute latency domination.
          </p>
        </header>

        {/* Deliverables Metrics Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-28">
          {[
            { label: "Transit Engine", value: "NY4 / LD4 Loop", desc: "Equinix Cross-Connection" },
            { label: "Speed Benchmark", value: "< 0.45 ms", desc: "Execution Bridge Sync" },
            { label: "Router Standard", value: "FIX 4.4 / 4.2", desc: "Engine Alignment Protocol" },
            { label: "Slippage Protection", value: "Smart SOR", desc: "Smart Order Routing Desk" }
          ].map((m, idx) => (
            <article key={idx} className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 block mb-2">{m.label}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-1 uppercase">{m.value}</h3>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{m.desc}</span>
            </article>
          ))}
        </section>

        {/* Main Content Details Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-6xl mx-auto mb-28">
          {/* Left panel: Core Value Props */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-[0.25em]">
                Direct Core Connectivity
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight italic">
                Sovereign Liquidity Aggregation.
              </h2>
              <p className="text-xs sm:text-sm font-bold text-blue-400/90 leading-relaxed max-w-lg">
                <strong>IFX Trades execution bridges deploy sub-millisecond FIX API engine alignment directly within Equinix NY4 and LD4 hubs, achieving under 0.45ms routing latency.</strong>
              </p>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">
                Our bridges act as zero-leakage pathways between broker terminals (MT4/MT5) and global Tier-1 liquidity pools. We program routing rules directly into execution cards to optimize fill ratios and eliminate synthetic slippage.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { 
                  icon: Zap, 
                  title: "Smart Order Routing (SOR)", 
                  desc: "Automatically splits large orders across deep ECN aggregates to secure best-bid-best-offer pricing with minimum slippage impact." 
                },
                { 
                  icon: Cpu, 
                  title: "FIX API Engine Alignment", 
                  desc: "Connect prop desks, automated systems, or customized terminals using optimized FIX API configurations for institutional alignment." 
                },
                { 
                  icon: Network, 
                  title: "Equinix Fiber-Optic Loops", 
                  desc: "Physically co-located adjacent to leading banks and market makers inside NY4 and LD4 hubs via secure fiber loops." 
                },
                { 
                  icon: Workflow, 
                  title: "Sub-Millisecond Latency Profiling", 
                  desc: "Continually profiles system paths every 500ms to instantly route orders away from gridlocked network vectors." 
                }
              ].map((prop, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                    <prop.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black uppercase text-white tracking-tight leading-none">{prop.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">{prop.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Tech Matrix Table (GEO Boost) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-[3.5rem] bg-[#030508]/80 border border-white/10 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                <TableProperties className="w-5 h-5 text-blue-400" />
                Execution Telemetry Matrix
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">
                Technical profiling parameters of IFX Trades execution bridges.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-[9px] font-black uppercase tracking-wider text-blue-400">
                      <th className="pb-3 pr-4">Parameter</th>
                      <th className="pb-3 px-4">Specification</th>
                      <th className="pb-3 pl-4">Target Benchmark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-white uppercase">Co-location Location</td>
                      <td className="py-3.5 px-4">Equinix NY4, LD4, SG1</td>
                      <td className="py-3.5 pl-4 text-emerald-400 font-bold">Physical Cabinet</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-white uppercase">Protocol Version</td>
                      <td className="py-3.5 px-4">FIX 4.4 / 4.2 Engine</td>
                      <td className="py-3.5 pl-4 text-emerald-400 font-bold">Ultra-Low Overhead</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-white uppercase">Average Latency</td>
                      <td className="py-3.5 px-4">0.32 ms - 0.45 ms</td>
                      <td className="py-3.5 pl-4 text-emerald-400 font-bold">Sub-Millisecond</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-white uppercase">Smart Order Router</td>
                      <td className="py-3.5 px-4">Aggregated VWAP Filling</td>
                      <td className="py-3.5 pl-4 text-emerald-400 font-bold">Best Ask/Bid</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-white uppercase">Throughput Rate</td>
                      <td className="py-3.5 px-4">12,500 messages/sec</td>
                      <td className="py-3.5 pl-4 text-emerald-400 font-bold">Zero-Congestion</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-white uppercase">Terminal Bridges</td>
                      <td className="py-3.5 px-4">Native MT4 / MT5 Server</td>
                      <td className="py-3.5 pl-4 text-emerald-400 font-bold">Optimized C++ Link</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-black text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                >
                  Request Integration Session
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* GEO Optimization Article Section */}
        <section className="max-w-4xl mx-auto p-10 rounded-[3rem] bg-white/[0.01] border border-white/5 space-y-6">
          <h3 className="text-lg font-black uppercase text-blue-400 font-mono tracking-widest">
            Topological Architecture Overview
          </h3>
          <article className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-400 leading-relaxed space-y-4">
            <p>
              The <strong>IFX Trades Execution Bridge</strong> is an optimized high-throughput interface that connects trading systems to wholesale liquidity aggregates. By co-locating MT4/MT5 server modules directly inside primary financial exchanges (New York Equinix NY4, London Equinix LD4, Singapore Equinix SG1), execution paths are reduced to fiber-optic spans of less than 100 meters.
            </p>
            <p>
              Utilizing a custom-compiled C++ core, the bridge translates terminal execution packages into native FIX API packets. By bypassing translation layers that introduce slippage, the broker is aligned with raw institutional pricing. Additionally, our <strong>Smart Order Routing (SOR)</strong> engine queries price depth matrix tables dynamically to optimize partial fills, guaranteeing institutional execution standards for retail clients.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
};
