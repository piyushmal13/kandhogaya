import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { webinarService } from "@/services/webinarService";
import { Check, X, Zap, Clock, ArrowRight, Monitor } from "lucide-react";
import { cn } from "@/utils/cn";
import { PurchaseModal } from "@/components/payments/PurchaseModal";
import { tracker } from "@/core/tracker";
import { motion } from "motion/react";

const SIGNAL_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 49,
    description: "Core access for emerging traders.",
    features: ["Institutional Research Feed", "Market Architecture Analysis", "Elite Comm Access", "Direct Email Desk"],
    notIncluded: ["Academy Enclave", "Algo Deployment", "Webinar Archive"],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    description: "Institutional features for active traders.",
    features: ["Everything in Basic", "IFX Trade Academy", "Strategy Workshops", "Priority Engineering Support"],
    notIncluded: ["Algo Deployment", "Webinar Archive"],
    popular: true
  },
  {
    id: "elite",
    name: "Elite",
    price: 249,
    description: "Full IFX suite for master traders.",
    features: ["Everything in Pro", "Algo Terminal Access", "Private Webinars", "1-on-1 Quant Mentorship"],
    notIncluded: [],
    popular: false
  }
];

export const Pricing = () => {
  // 🚀 [CTO] Intelligence Data Rails
  const { data: algos = [], isLoading: algosLoading } = useQuery({
    queryKey: ['pricing_algos'],
    queryFn: () => productService.getAlgoBots(3),
    staleTime: 600000,
  });

  const { data: webinarsResult = [], isLoading: webinarsLoading } = useQuery({
    queryKey: ['pricing_webinars'],
    queryFn: () => webinarService.getWebinars(),
    staleTime: 600000,
  });

  const webinars = useMemo(() => webinarsResult.slice(0, 3), [webinarsResult]);
  const loading = algosLoading || webinarsLoading;

  const [selectedPlan, setSelectedPlan] = useState<{ plan: string, amount: number } | null>(null);
  const [pricingViews, setPricingViews] = useState(0);

  useEffect(() => {
    tracker.track("page_view", { surface: "pricing" });
    
    // Smart Pricing Intelligence
    const views = Number.parseInt(localStorage.getItem("ifx_pricing_views") || "0") + 1;
    localStorage.setItem("ifx_pricing_views", views.toString());
    setPricingViews(views);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020202] pt-32 md:pt-48 pb-32 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32 relative">
          {pricingViews >= 3 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(16,185,129,0.3)] z-50 italic"
            >
               Growth Incentive Activated: 10% Discount at Auth
            </motion.div>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-shimmer mb-10 text-center"
          >
            Elite <br />
            <span className="italic font-serif text-gradient-emerald">Access.</span>
          </motion.h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 max-w-2xl mx-auto italic">
            Choose your execution tier and unlock professional trading workflows.
          </p>
        </div>

        {/* --- Signal Plans --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-48">
          {SIGNAL_PLANS.map((plan, idx) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all duration-700 group flex flex-col",
                plan.popular 
                  ? "bg-emerald-500/[0.03] border-emerald-500/30 shadow-[0_40px_80px_rgba(16,185,129,0.1)] md:scale-[1.05] z-10" 
                  : "bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.02] hover:border-white/[0.15]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] italic">
                  Most Popular
                </div>
              )}
              
              <div className="mb-12 text-center">
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest italic">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-sm font-black text-emerald-500/40 uppercase tracking-widest">$</span>
                  <span className="text-6xl font-black text-white tracking-tighter tabular-nums italic">{plan.price}</span>
                  <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] ml-2">/mo</span>
                </div>
              </div>

              <div className="space-y-6 mb-12 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-4">
                    <div className={cn(
                      "w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all duration-700",
                      plan.popular ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-white/20 border-white/10"
                    )}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/50">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-4 opacity-15">
                    <div className="w-5 h-5 flex items-center justify-center text-white/20 shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/40">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  tracker.track("pricing_click", { plan: plan.id, amount: plan.price });
                  setSelectedPlan({ plan: plan.id, amount: plan.price });
                }}
                className={cn(
                  "w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 italic",
                  plan.popular 
                    ? "bg-white text-black hover:scale-[1.02] shadow-[0_20px_40px_rgba(255,255,255,0.1)]" 
                    : "bg-white/5 text-white hover:bg-white/10 hover:scale-[1.02]"
                )}
              >
                Execute Access
              </button>
            </motion.div>
          ))}
        </div>

        {/* --- Performance Algos --- */}
        <div className="mb-48">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-4">Algorithmic Execution</h2>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] italic">Professional quantitative trading engines</p>
            </div>
            <Link to="/marketplace" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 hover:text-white transition-colors flex items-center gap-2 italic group">
              View All Engines <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-80 bg-white/5 rounded-[3.5rem] animate-pulse" />)
            ) : (
              algos.map((algo) => (
                <div key={algo.id} className="p-12 rounded-[3.5rem] bg-[#080B12] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-700 flex flex-col justify-between group hover:shadow-2xl">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 flex items-center justify-center text-emerald-500/60 mb-10 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-700">
                      <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">{algo.name}</h3>
                    <p className="text-[11px] text-white/30 mb-10 line-clamp-2 leading-relaxed font-light">{algo.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-10 border-t border-white/[0.06]">
                    <div className="flex flex-col">
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Entry Value</span>
                      <span className="text-white font-black text-2xl tabular-nums italic">${algo.price}</span>
                    </div>
                    <Link 
                      to="/marketplace" 
                      onClick={() => tracker.track("algo_click", { product: algo.name, price: algo.price })}
                      className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all duration-700"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Upcoming Webinars --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="p-[1px] rounded-[4rem] bg-gradient-to-br from-emerald-500/40 via-white/10 to-transparent transition-all duration-700"
          >
            <div className="p-16 rounded-[4rem] bg-[#080B12] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full opacity-20 -z-10" />
              <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tighter italic">Live Training</h2>
              <p className="text-white/40 text-[13px] font-light leading-relaxed mb-12 max-w-lg">
                Join our elite analysts for sessions on market structure, institutional order flow, and quantitative risk management.
              </p>
              <Link to="/webinars" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.05] transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] italic">
                View Calendar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <div className="space-y-8">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-40 bg-white/5 rounded-[3.5rem] animate-pulse" />)
            ) : (
              webinars.map((webinar) => (
                <div key={webinar.id} className="p-10 rounded-[3.5rem] bg-[#080B12] border border-white/[0.06] hover:bg-white/[0.02] hover:border-emerald-500/30 transition-all duration-700 flex items-center justify-between group">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/20 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all duration-700">
                      <Monitor className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic line-clamp-1 mb-3">{webinar.title}</h4>
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                          <Clock className="w-3.5 h-3.5 text-emerald-500/40" />
                          {new Date(webinar.date_time).toLocaleDateString()}
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg italic border border-emerald-500/20">Live Session</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/webinars" className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all duration-700">
                    <ArrowRight className="w-6 h-6" />
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
