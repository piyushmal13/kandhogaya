import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building, 
  ShieldCheck, 
  Activity, 
  Send, 
  Cpu, 
  Zap, 
  Globe, 
  Server, 
  FileTerminal 
} from "lucide-react";
import { leadService } from "../services/crm/leadService";
import { useToast } from "../contexts/ToastContext";
import { PageMeta } from "../components/site/PageMeta";

export const B2BLiquidity = () => {
  const { success, error: toastError } = useToast();
  const [brokerName, setBrokerName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [volume, setVolume] = useState("Under $500M");
  const [protocol, setProtocol] = useState("FIX 4.4");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brokerName || !contactName || !email) return;

    setIsSubmitting(true);
    try {
      const result = await leadService.createLead({
        email: email.trim(),
        source: "b2b_liquidity_desk",
        stage: "B2B_PARTNER",
        crm_metadata: {
          broker_name: brokerName.trim(),
          contact_officer: contactName.trim(),
          monthly_volume: volume,
          protocol: protocol,
          system_telemetry: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        }
      });

      if (result.success) {
        success("B2B Liquidity Brief safely transmitted to institutional desk.");
        setIsSuccess(true);
        setBrokerName("");
        setContactName("");
        setEmail("");
      } else {
        toastError(result.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error("B2B Submission Error:", err);
      toastError("Network connection interrupted. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#010203] text-white selection:bg-emerald-500 selection:text-black min-h-screen pt-36 pb-24 overflow-hidden relative">
      <PageMeta 
        title="B2B Liquidity Integration Desk" 
        description="Connect your brokerage to direct Tier-1 institutional ECN liquidity aggregates. FIX 4.4, MT4/MT5 bridges, and sub-millisecond execution routing."
        path="/b2b/liquidity"
      />

      {/* Ambient background VFX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em]">
            <Server className="w-3.5 h-3.5 animate-pulse" />
            Institutional B2B Infrastructure
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none italic">
            Direct ECN <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Liquidity</span> Aggregation.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Aggregated multi-asset liquidity sourced from 15+ Tier-1 global banking institutions. Built to support brokerages, hedge funds, and corporate trading floors.
          </p>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-24">
          {[
            { label: "Fill Speed", value: "< 0.95ms", desc: "Sub-millisecond direct routing" },
            { label: "Raw Spreads", value: "0.0 Pips", desc: "Zero broker markup feeds" },
            { label: "Bank Liquidity Pools", value: "15+ Nodes", desc: "Tier-1 prime brokers" },
            { label: "Supported Volume", value: "$3.5B+", desc: "Aggregated monthly capacity" }
          ].map((m, idx) => (
            <div key={idx} className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400/60 block mb-2">{m.label}</span>
              <h3 className="text-2xl font-black text-white tracking-tighter mb-1 uppercase">{m.value}</h3>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{m.desc}</span>
            </div>
          ))}
        </div>

        {/* Split Grid: Value Proposition & Request form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left panel: Value Props */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-[0.25em]">
                Direct Market Access
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight italic">
                Why Brokerages Partner With IFX.
              </h2>
            </div>

            <div className="space-y-8">
              {[
                { 
                  icon: Cpu, 
                  title: "FIX 4.4 Protocol Bridge", 
                  desc: "Connect your MT4, MT5, cTrader, or custom proprietary execution server via a secure, ultra-low latency FIX API node." 
                },
                { 
                  icon: Zap, 
                  title: "Depth of Market Aggregation", 
                  desc: "Access aggregated order books exceeding $750,000,000 per leg across major currency pairs, metals, and macro index assets." 
                },
                { 
                  icon: Globe, 
                  title: "Distributed Equinix Racks", 
                  desc: "Our liquidity aggregation servers are co-located in Equinix NY4, LD4, and TY3 data centers, maximizing regional route speed." 
                }
              ].map((prop, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
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

          {/* Right panel: Glassmorphic Request Form */}
          <div className="lg:col-span-6">
            <div className="p-10 rounded-[3rem] bg-[#030508]/80 border border-white/10 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Request Liquidity Setup</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Connect your server directly to our institutional feed.</p>
                  </div>

                  {/* Broker Name */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Brokerage / Company Name</label>
                    <input 
                      type="text" 
                      required 
                      value={brokerName}
                      onChange={(e) => setBrokerName(e.target.value)}
                      placeholder="e.g. Sovereign Markets Corp"
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                    />
                  </div>

                  {/* Contact Name */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Authorized Contact Officer</label>
                    <input 
                      type="text" 
                      required 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alexander Vance"
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                    />
                  </div>

                  {/* Business Email */}
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Business Email Node</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. operations@sovereignmarkets.com"
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-mono"
                    />
                  </div>

                  {/* Two column dropdown selectors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Est. Monthly Volume</label>
                      <select 
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="w-full bg-[#030508] border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                      >
                        <option value="Under $500M">Under $500M</option>
                        <option value="$500M - $1B">$500M - $1B</option>
                        <option value="$1B - $5B">$1B - $5B</option>
                        <option value="Above $5B">Above $5B</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Target Bridge Protocol</label>
                      <select 
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value)}
                        className="w-full bg-[#030508] border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500/30 transition-all font-medium"
                      >
                        <option value="FIX 4.4">FIX 4.4 API</option>
                        <option value="MT5 Gateway">MT5 Gateway</option>
                        <option value="MT4 Bridge">MT4 Bridge</option>
                        <option value="REST Socket">REST Web Socket</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Transmit Integration Request
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-white font-black text-xl uppercase tracking-tighter">Request Safely Logged</h4>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                    Your B2B Liquidity integration brief has been registered. An aggregation specialist will initiate communication with your secure email node within 12 business hours.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 border border-white/5 bg-white/[0.02] hover:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                  >
                    Submit Another Brief
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
