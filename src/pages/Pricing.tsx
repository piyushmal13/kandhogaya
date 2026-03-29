import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { webinarService } from "@/services/webinarService";
import { Check, X, Zap, Clock, ArrowRight, Monitor } from "lucide-react";
import { cn } from "@/utils/cn";
import { PurchaseModal } from "@/components/payments/PurchaseModal";
import { Product, Webinar } from "@/types";
import { tracker } from "@/core/tracker";

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
  const [algos, setAlgos] = useState<Product[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: string, amount: number } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    console.log("💰 [PRICING FETCH] START");
    try {
      const [algoData, webinarData] = await Promise.all([
        productService.getAlgoBots(3),
        webinarService.getWebinars()
      ]);
      
      console.log("💰 [PRICING FETCH] RESPONSE", { algos: algoData.length, webinars: webinarData.length });
      setAlgos(algoData);
      setWebinars(webinarData.slice(0, 3)); // Match the limit(3) from original logic
    } catch (err) {
      console.error("💰 [PRICING FETCH] ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const [pricingViews, setPricingViews] = useState(0);

  useEffect(() => {
    fetchData();
    tracker.track("page_view", { surface: "pricing" });
    
    // Smart Pricing Intelligence
    const views = Number.parseInt(localStorage.getItem("ifx_pricing_views") || "0") + 1;
    localStorage.setItem("ifx_pricing_views", views.toString());
    setPricingViews(views);
  }, []);

  console.log("RENDER PRICING DATA:", { algos, webinars });

  return (
    <div className="relative min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 relative">
          {pricingViews >= 3 && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest animate-bounce">
               Limited Time Growth Offer Activated: 10% Discount on Checkout
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter italic">
            Institutional <span className="text-emerald-500">Access.</span>
          </h1>
          <p className="text-gray-500 text-lg font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            Choose your execution tier and unlock professional trading workflows.
          </p>
        </div>

        {/* --- Signal Plans --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {SIGNAL_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={cn(
                "relative p-10 rounded-[48px] border transition-all duration-500 group",
                plan.popular 
                  ? "bg-emerald-500/5 border-emerald-500/30 scale-105 shadow-[0_0_80px_rgba(16,185,129,0.1)] z-10" 
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                  Most Popular
                </div>
              )}
              
              <div className="mb-10 text-center">
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter tabular-nums">${plan.price}</span>
                  <span className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">/mo</span>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium leading-tight">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 opacity-30">
                    <div className="w-5 h-5 flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  tracker.track("pricing_click", { plan: plan.id, amount: plan.price });
                  setSelectedPlan({ plan: plan.id, amount: plan.price });
                }}
                className={cn(
                  "w-full py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] transition-all",
                  plan.popular 
                    ? "bg-emerald-500 text-black hover:bg-white shadow-xl shadow-emerald-500/20" 
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* --- Performance Algos --- */}
        <div className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Algorithmic Execution</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Professional quantitative trading engines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[48px] animate-pulse" />)
            ) : (
              algos.map((algo) => (
                <div key={algo.id} className="p-10 rounded-[48px] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">{algo.name}</h3>
                    <p className="text-sm text-gray-400 mb-8 line-clamp-2 leading-relaxed">{algo.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Pricing</span>
                      <span className="text-white font-black text-xl tabular-nums">${algo.price}</span>
                    </div>
                    <Link 
                      to="/marketplace" 
                      onClick={() => tracker.track("algo_click", { product: algo.name, price: algo.price })}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Upcoming Webinars --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="p-1.5 rounded-[56px] bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl shadow-emerald-500/20">
            <div className="p-14 rounded-[52px] bg-black">
              <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Live Training</h2>
              <p className="text-gray-400 font-medium leading-relaxed mb-10">
                Join our elite analysts for sessions on market structure, institutional order flow, and quantitative risk management.
              </p>
              <Link to="/webinars" className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-xl shadow-emerald-500/20">
                View Calendar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-32 bg-white/5 rounded-[40px] animate-pulse" />)
            ) : (
              webinars.map((webinar) => (
                <div key={webinar.id} className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                      <Monitor className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-tight italic line-clamp-1">{webinar.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          {new Date(webinar.date_time).toLocaleDateString()}
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg">LIVE SESSION</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/webinars" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
