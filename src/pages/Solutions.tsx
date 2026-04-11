import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  BarChart
} from "lucide-react";
import { SovereignButton } from "../components/ui/Button";
import { PageMeta } from "../components/site/PageMeta";
import { Link } from "react-router-dom";

const SOLUTION_TIERS = [
  {
    icon: Target,
    title: "Institutional Research",
    subtitle: "Macro Edge Hub",
    features: [
      "Daily XAUUSD Macro Reports",
      "Sovereign Liquidity Heatmaps",
      "Executive Signal Alerts",
      "Weekly Strategic Briefings"
    ],
    cta: "Access Intelligence",
    link: "/login",
    color: "cyan"
  },
  {
    icon: Cpu,
    title: "Algorithmic License",
    subtitle: "Quant Execution",
    features: [
      "Proprietary MT5 Bot Access",
      "Risk-Locked Hedging Engine",
      "Zero-Lag Execution Nodes",
      "Performance Sync Dashboard"
    ],
    cta: "Deploy Algorithm",
    link: "/marketplace",
    color: "emerald",
    featured: true
  },
  {
    icon: TrendingUp,
    title: "The Masterclass",
    subtitle: "Terminal Mastery",
    features: [
      "End-to-End Algo Training",
      "Python Dev Environment",
      "1-on-1 Mentor Synthesis",
      "Hiring Eligibility (Level 3)"
    ],
    cta: "Join Class",
    link: "/academy",
    color: "purple"
  }
];

export const Solutions = () => {
  return (
    <div className="py-20 md:py-32">
      <PageMeta 
        title="Institutional Solutions"
        description="High-alpha algorithmic licenses and macro intelligence for the top 1% of traders."
        path="/solutions"
      />

      <div className="container mx-auto px-6">
        {/* ── HEADER ── */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <ShieldCheck className="w-3 h-3" /> Zero Broker Conflict Guaranteed
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.85] mb-8">
            The <span className="text-cyan-500">Revenue</span> <br /> Engine
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed uppercase font-medium tracking-wide">
             We provide the infrastructure. You dominate the execution. Modular solutions engineered for the systematic trader.
          </p>
        </div>

        {/* ── TIERS ── */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {SOLUTION_TIERS.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[3rem] border ${
                tier.featured 
                  ? 'border-emerald-500/30 bg-emerald-500/[0.03] shadow-[0_0_80px_rgba(16,185,129,0.05)]' 
                  : 'border-white/5 bg-white/[0.02]'
              } hover:border-white/10 transition-all group`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                  MOST DEPLOYED
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                tier.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                tier.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                'bg-purple-500/10 text-purple-500'
              }`}>
                <tier.icon className="w-6 h-6" />
              </div>

              <div className="mb-10">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{tier.title}</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{tier.subtitle}</p>
              </div>

              <ul className="space-y-4 mb-12">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                      tier.color === 'cyan' ? 'text-cyan-500' :
                      tier.color === 'emerald' ? 'text-emerald-500' :
                      'text-purple-500'
                    }`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to={tier.link}>
                <SovereignButton 
                  fluid 
                  variant={tier.featured ? 'sovereign' : 'secondary'}
                  size="lg"
                  rightIcon={<ArrowRight />}
                >
                  {tier.cta}
                </SovereignButton>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── TRUST SECTION ── */}
        <div className="rounded-[4rem] bg-[#1a1f29] border border-white/5 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] -z-10" />
          
          <div className="space-y-6 max-w-xl text-center md:text-left">
             <div className="flex items-center gap-3 text-gray-500">
               <Lock className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Corporate Guarantee</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
               Need an Enterprise <br />
               <span className="text-cyan-500">Custom Setup?</span>
             </h2>
             <p className="text-gray-400 leading-relaxed uppercase text-sm font-semibold tracking-wide">
               For institutional desks managing {'>'}$5M AUM, we offer dedicated API endpoints and private strategic consulting.
             </p>
          </div>

          <Link to="/consultation">
            <SovereignButton variant="sovereign" size="xl" glowEffect rightIcon={<BarChart className="w-5 h-5 ml-2" />}>
              Request Boardroom Call
            </SovereignButton>
          </Link>
        </div>

      </div>
    </div>
  );
};
