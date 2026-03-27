import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Check, 
  X, 
  Zap, 
  Clock,
  ArrowRight,
  Monitor
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PurchaseModal } from "@/components/payments/PurchaseModal";

interface AlgoProduct {
  id: string;
  name: string;
  price: number;
  monthly_roi?: string;
  win_rate?: string;
}

interface Webinar {
  id: string;
  title: string;
  price: number;
  date: string;
}

const SIGNAL_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 49,
    description: "Core access for emerging traders.",
    features: ["Daily Crypto Signals", "Market Analysis", "Telegram Access", "Email Support"],
    notIncluded: ["Academy Access", "Algo Access", "Webinar Access"],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    description: "Institutional features for active traders.",
    features: ["Everything in Basic", "IFX Trade Academy", "Strategy Workshops", "Priority Support"],
    notIncluded: ["Algo Access", "Webinar Access"],
    popular: true
  },
  {
    id: "elite",
    name: "Elite",
    price: 249,
    description: "Full IFX suite for master traders.",
    features: ["Everything in Pro", "Algo Terminal Access", "Private Webinars", "1-on-1 Mentorship"],
    notIncluded: [],
    popular: false
  }
];

export const Pricing = () => {
  const [algos, setAlgos] = useState<AlgoProduct[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: string, amount: number } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [algoRes, webinarRes] = await Promise.all([
        supabase.from("algo_bots").select("*").limit(3),
        supabase.from("webinars").select("*").gte("date", new Date().toISOString()).limit(3)
      ]);
      
      setAlgos(algoRes.data || []);
      setWebinars(webinarRes.data || []);
    } catch (err) {
      console.error("Institutional Pricing Discovery Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    globalThis.addEventListener("app:login", fetchData);
    globalThis.addEventListener("app:logout", fetchData);
    globalThis.addEventListener("supabase:refresh", fetchData);

    return () => {
      globalThis.removeEventListener("app:login", fetchData);
      globalThis.removeEventListener("app:logout", fetchData);
      globalThis.removeEventListener("supabase:refresh", fetchData);
    };
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32 overflow-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* Background Orbs: Institutional Depth Signal */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        
        {/* Urgency Signal: High-Conversion Orchestration */}
        <div className="mb-12 flex justify-center animate-in slide-in-from-top-4 duration-700">
          <div className="px-8 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/5">
            ⚡ Institutional Alert: Limited Time Offer – Prices Increasing Soon
          </div>
        </div>
        
        {/* Header Discovery: Urgency Signal */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] animate-in slide-in-from-top-4 duration-700">
            <Clock className="w-3 h-3" />
            Limited Institutional Enrollment
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] animate-in slide-in-from-bottom-4 duration-700 delay-100">
            Institutional <span className="text-emerald-500">Tiered</span> Access.
          </h1>
          <p className="text-lg text-gray-500 font-medium tracking-tight delay-200 animate-in fade-in max-w-2xl mx-auto">
            Synchronize your execution with the IFX Trades ecosystem. Transparent pricing, high-fidelity signals, and institutional-grade algorithmic discovery.
          </p>
          <div className="flex items-center justify-center gap-12 pt-8 delay-300 animate-in fade-in">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">1000+</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Elite Traders</span>
            </div>
            <div className="w-[1px] h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">24/7</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Market Discovery</span>
            </div>
            <div className="w-[1px] h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">99%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Fulfillment Uptime</span>
            </div>
          </div>
        </div>

        {/* Signals Discovery Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {SIGNAL_PLANS.map((plan, idx) => (
            <div 
              key={plan.id}
              className={cn(
                "group relative p-10 rounded-[48px] border transition-all duration-500 hover:scale-[1.05] active:scale-[0.98] hover:shadow-2xl hover:bg-white/[0.07]",
                plan.popular 
                  ? "bg-white/5 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-105 z-20" 
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-30">
                  🔥 MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">{plan.name} DISCOVERY</div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
                  <span className="text-sm font-bold text-gray-500 mb-2 uppercase">/ Month</span>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 pb-10 border-b border-white/10">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-3 group/item">
                    <div className="w-5 h-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center transition-all group-hover/item:scale-125">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover/item:text-white transition-colors">{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map(f => (
                  <div key={f} className="flex items-center gap-3 opacity-30">
                    <div className="w-5 h-5 bg-white/5 border border-white/10 text-gray-600 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-gray-600 line-through">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setSelectedPlan({ plan: plan.id, amount: plan.price })}
                className={cn(
                  "w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 group/btn hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
                  plan.popular 
                    ? "bg-emerald-500 text-black hover:bg-white active:bg-emerald-600 shadow-xl shadow-emerald-500/20" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black"
                )}
              >
                {(() => {
                  if (plan.id === 'basic') return "Unlock Signals";
                  if (plan.id === 'pro') return "Join Pro Traders";
                  return "Start Earning Now";
                })()}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Algo & Webinar Discovery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          
          {/* Algo Marketplace: High-Density Signal */}
          <div className="space-y-8 p-12 bg-white/5 border border-white/10 rounded-[56px] backdrop-blur-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Algo Inventory</h2>
              <Zap className="w-8 h-8 text-emerald-500" />
            </div>
            
            <div className="space-y-4">
              {algos.map(algo => (
                <div key={algo.id} className="p-8 bg-[#080808] border border-white/5 hover:border-emerald-500/30 rounded-[32px] transition-all flex justify-between items-center group">
                  <div>
                    <div className="text-lg font-black text-white uppercase tracking-tight mb-1">{algo.name}</div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">
                       {algo.monthly_roi && <span className="px-2 py-0.5 bg-emerald-500/10 rounded-full">ROI: {algo.monthly_roi}</span>}
                       {algo.win_rate && <span className="px-2 py-0.5 bg-emerald-500/10 rounded-full">WIN: {algo.win_rate}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPlan({ plan: `Algo: ${algo.name}`, amount: algo.price })}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-emerald-500 hover:text-black rounded-2xl uppercase tracking-widest transition-all"
                  >
                    Buy ${algo.price}
                  </button>
                </div>
              ))}
              {algos.length === 0 && !loading && (
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center py-20">Zero Algorithm Discovery Signals</p>
              )}
            </div>
          </div>

          {/* Webinars Discovery: Temporal Capability Signal */}
          <div className="space-y-8 p-12 bg-white/5 border border-white/10 rounded-[56px] backdrop-blur-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Live Sessions</h2>
              <Monitor className="w-8 h-8 text-emerald-500" />
            </div>
            
            <div className="space-y-4">
              {webinars.map(session => (
                <div key={session.id} className="p-8 bg-[#080808] border border-white/5 hover:border-emerald-500/30 rounded-[32px] transition-all flex justify-between items-center group">
                  <div>
                    <div className="text-lg font-black text-white uppercase tracking-tight mb-1">{session.title}</div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Scheduled: {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPlan({ plan: `Webinar: ${session.title}`, amount: session.price })}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-emerald-500 hover:text-black rounded-2xl uppercase tracking-widest transition-all"
                  >
                    Book ${session.price}
                  </button>
                </div>
              ))}
              {webinars.length === 0 && !loading && (
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center py-20">Zero Webinar Signals in Buffer</p>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Discovery Table */}
        <div className="max-w-4xl mx-auto p-12 bg-white/5 border border-white/10 rounded-[56px] backdrop-blur-xl mb-32 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-8 text-[10px] font-black uppercase tracking-widest text-gray-500">Capability Signal</th>
                <th className="py-8 text-[12px] font-black uppercase tracking-widest text-center">Basic</th>
                <th className="py-8 text-[12px] font-black uppercase tracking-widest text-center text-emerald-500">Pro</th>
                <th className="py-8 text-[12px] font-black uppercase tracking-widest text-center">Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { label: "High-Fidelity Signals", basic: true, pro: true, elite: true },
                { label: "IFX Trade Academy", basic: false, pro: true, elite: true },
                { label: "Institutional Algos", basic: false, pro: false, elite: true },
                { label: "Private Webinars", basic: false, pro: false, elite: true },
                { label: "Priority fulfillment", basic: false, pro: true, elite: true }
              ].map(row => (
                <tr key={row.label} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{row.label}</td>
                  <td className="py-6 text-center">{row.basic ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <X className="w-4 h-4 mx-auto text-gray-700" />}</td>
                  <td className="py-6 text-center">{row.pro ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <X className="w-4 h-4 mx-auto text-gray-700" />}</td>
                  <td className="py-6 text-center">{row.elite ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <X className="w-4 h-4 mx-auto text-gray-700" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Guarantee Signal Discovery */}
        <div className="mb-32 flex flex-col items-center gap-4 text-gray-500 animate-pulse">
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Secure Payment Verification</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Instant Access After Approval</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Trusted by 1000+ Traders</div>
            </div>
        </div>

        {/* Testimonial Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { text: "Made my first profit in 7 days. High-fidelity signals are institutional grade.", author: "Elite Trader" },
            { text: "Best signals platform in the ecosystem. Absolute execution clarity.", author: "Pro Member" },
            { text: "Highly accurate trades. The algo discovery is a game changer.", author: "Institutional User" }
          ].map(t => (
            <div key={t.author} className="p-10 bg-white/5 border border-white/10 rounded-[40px] italic text-sm text-gray-400 leading-relaxed hover:border-emerald-500/20 transition-all">
              "{t.text}"
              <span className="block not-italic text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-6">— {t.author}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fulfillment Trigger */}
      {selectedPlan && (
        <PurchaseModal 
          plan={selectedPlan.plan}
          amount={selectedPlan.amount}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};
