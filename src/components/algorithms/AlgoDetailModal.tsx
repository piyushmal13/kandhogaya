import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  X, Check, ArrowRight, ShieldCheck, 
  Activity, Zap, HelpCircle, Star, 
  BarChart3, Lock, FileText, TrendingUp, Share2
} from "lucide-react";
import { Product } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { Sparkline } from "../ui/Sparkline";
import { ResizedImage } from "../ui/ResizedImage";

interface AlgoDetailModalProps {
  algo: Product;
  onClose: () => void;
  onSubscribe: (algo: Product, plan: string) => void;
}

export const AlgoDetailModal = ({ algo, onClose, onSubscribe }: AlgoDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'reviews' | 'qa' | 'terms'>('overview');
  const { user } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const performance = algo.performance || {
    win_rate: 0,
    monthly_return: 0,
    drawdown: 0,
    total_trades: 0,
    is_live: false,
    equity_curve: [0, 0, 0, 0, 0]
  };

  const handleSubscribeClick = (plan: string) => {
    if (!user) {
      info("Please sign in to access the institutional terminal and subscribe.");
      navigate("/login");
      return;
    }
    onSubscribe(algo, plan);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[var(--color7)] border border-white/10 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white/10 transition-colors text-white"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Left: Details & Tabs */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto border-b md:border-b-0 md:border-r border-white/5">
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-mono tracking-widest mb-3 md:mb-4">
              <Zap className="w-3 h-3" />
              {algo.category || "Algorithm"}
            </div>
            <div className="flex justify-between items-start gap-4 mb-3 md:mb-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white">{algo.name}</h2>
              <button 
                onClick={() => {
                  let url = `${globalThis.location.origin}/marketplace`;
                  if (user?.role === 'admin' || user?.role === 'agent') {
                      url += `?ref=${user.id.slice(0, 8)}`;
                  }
                  globalThis.navigator.clipboard.writeText(url);
                  info("Referral link copied to clipboard!");
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-colors border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap mt-1"
                title={user?.role === 'admin' || user?.role === 'agent' ? "Copy Your Referral Link" : "Share Link"}
              >
                <Share2 className="w-3 h-3" /> {user?.role === 'admin' || user?.role === 'agent' ? "Copy Link" : "Share"}
              </button>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm md:text-lg">{algo.description}</p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-4 md:gap-6 border-b border-white/5 mb-6 md:mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {['overview', 'performance', 'reviews', 'qa', 'terms'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 md:pb-4 text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-emerald-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px] md:min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-6 md:space-y-8">
                {algo.video_explanation_url && (
                  <div>
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-500" />
                      Institutional Model Research Brief
                    </h4>
                    <div className="aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-black border border-white/10 relative group">
                      <iframe 
                        src={algo.video_explanation_url.includes('youtube.com') ? algo.video_explanation_url.replace('watch?v=', 'embed/') : algo.video_explanation_url} 
                        className="w-full h-full"
                        title="Algorithm execution proof"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                
                {algo.strategy_details && (
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-500" />
                      Institutional Strategy Details
                    </h4>
                    <p className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">{algo.strategy_details}</p>
                  </div>
                )}

                {/* Proof Images Gallery */}
                {(algo.images && algo.images.length > 0) ? (
                  <div className="space-y-4">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      Verified Proof of Performance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {algo.images.map((img: string, idx: number) => (
                        <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 relative group bg-black">
                          <img src={img} alt={`Proof ${idx + 1}`} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : algo.image_url ? (
                  <div className="space-y-4">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      Verified Proof of Performance
                    </h4>
                    <div className="rounded-2xl overflow-hidden border border-white/10 relative group bg-black max-w-2xl">
                      <img src={algo.image_url} alt="Proof" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ) : null}

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Simulated Latency</div>
                      <div className="text-white font-mono font-bold">{(algo.performance as any)?.slippage || "0.12ms Node"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Recommended Capital</div>
                      <div className="text-white font-mono font-bold">{(algo.performance as any)?.min_capital || "$5,000"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Avg Monthly Return</div>
                      <div className="text-emerald-400 font-mono font-bold">+{algo.performance?.monthly_return || "12.4"}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Max Drawdown</div>
                      <div className="text-red-400 font-mono font-bold">-{algo.performance?.drawdown || "4.1"}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Real-time Intelligence Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 font-mono">Win Rate</div>
                      <div className="text-2xl font-black text-white italic">{performance.win_rate}%</div>
                   </div>
                   <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 font-mono">Return (Mo)</div>
                      <div className="text-2xl font-black text-emerald-500 italic">+{performance.monthly_return}%</div>
                   </div>
                   <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 font-mono">Max Drawdown</div>
                      <div className="text-2xl font-black text-white italic">-{performance.drawdown}%</div>
                   </div>
                   <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-center flex flex-col items-center justify-center">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 font-mono">Total Trades</div>
                      <div className="text-2xl font-black text-white italic">{performance.total_trades}</div>
                   </div>
                </div>

                <div className="bg-white/[0.02] rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl pointer-events-none">
                     <BarChart3 className="w-64 h-64 text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-8 uppercase italic flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    Institutional Equity Curve
                  </h4>
                  <div className="h-[200px] flex items-center justify-center relative z-10">
                    <Sparkline 
                        data={performance.equity_curve} 
                        color="var(--color8)" 
                        width={600} 
                        height={180} 
                    />
                  </div>
                </div>

                <div className="bg-white/[0.02] rounded-[3rem] p-10 border border-white/5">
                  <h4 className="text-xl font-black text-white mb-8 uppercase italic flex items-center gap-3">
                    <Activity className="w-6 h-6 text-emerald-500" />
                    Backtesting Verification
                  </h4>
                  <ResizedImage 
                    src={algo.backtesting_result_url || `https://picsum.photos/seed/${algo.id}backtest/800/400`} 
                    alt="Backtest Result" 
                    className="w-full h-auto rounded-3xl opacity-80" 
                  />
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {algo.reviews?.length ? algo.reviews.map((review) => (
                  <div key={review.id || review.user_name || Math.random()} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                          {(review.user_name || review.name || "U").charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-bold">{review.user_name || review.name}</div>
                          <div className="text-xs text-gray-500">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {['s1', 's2', 's3', 's4', 's5'].map((starKey, j) => (
                          <Star key={starKey} className={`w-3 h-3 ${j < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-600'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm italic">"{review.text}"</p>
                  </div>
                )) : (
                  <div className="text-center py-20 text-gray-500">No reviews yet for this algorithm.</div>
                )}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-6">
                {algo.q_and_a?.length ? algo.q_and_a.map((qa) => (
                  <div key={qa.question} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-start gap-4">
                      <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-bold mb-2">{qa.question}</h4>
                        <p className="text-gray-400 text-sm">{qa.answer}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 text-gray-500">No Q&A available for this algorithm.</div>
                )}
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Terms & Strategy Details
                </h4>
                <div className="prose prose-invert prose-sm max-w-none text-gray-400">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {algo.terms_and_conditions || "Standard institutional trading terms apply. This algorithm is designed for high-liquidity environments and requires a minimum capital allocation of $500. Past performance is not indicative of future results."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Subscription */}
        <div className="w-full md:w-[400px] bg-[var(--color6)] p-6 md:p-12 flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Subscription Plans</h3>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <button 
              onClick={() => handleSubscribeClick('Monthly')}
              className="w-full p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all text-left group"
            >
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <span className="text-white font-bold text-sm md:text-base">Monthly Access</span>
                <span className="text-xl md:text-2xl font-bold text-white">${algo.price}</span>
              </div>
              <p className="text-gray-500 text-[10px] md:text-xs">Full algorithm access with 24/5 support.</p>
            </button>

            {algo.long_plan_offers?.map((offer) => {
              const isPopular = offer.duration.toLowerCase() === 'yearly' || offer.duration.toLowerCase() === 'annual';
              return (
                <button 
                  key={offer.duration}
                  onClick={() => handleSubscribeClick(offer.duration)}
                  className={`w-full p-5 md:p-6 rounded-xl md:rounded-2xl transition-all text-left relative group ${isPopular ? 'bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-white/5 border border-white/10 hover:border-emerald-500/50'}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  {offer.discount && (
                    <div className="absolute -top-2.5 right-3 bg-red-500 text-white text-[8px] md:text-[9px] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full font-bold">
                      {offer.discount}
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-1 md:mb-2 mt-2">
                    <span className="text-white font-bold text-sm md:text-base">{offer.duration} Plan</span>
                    <span className="text-xl md:text-2xl font-bold text-emerald-400">${offer.price}</span>
                  </div>
                  <p className="text-gray-400 text-[10px] md:text-xs">Best value for long-term institutional trading.</p>
                </button>
              );
            })}
          </div>

          <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <li className="flex items-center gap-3 text-xs md:text-sm text-gray-300">
              <Check className="w-3.5 h-3.5 md:w-4 h-4 text-emerald-500" />
              Full Algorithm Access
            </li>
            <li className="flex items-center gap-3 text-xs md:text-sm text-gray-300">
              <Check className="w-3.5 h-3.5 md:w-4 h-4 text-emerald-500" />
              24/7 VPS Hosting Included
            </li>
            <li className="flex items-center gap-3 text-xs md:text-sm text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 md:w-4 h-4 text-emerald-500" />
              Institutional Liquidity
            </li>
          </ul>

          <button 
            onClick={() => handleSubscribeClick('Monthly')}
            className="w-full py-3.5 md:py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 group text-sm md:text-base"
          >
            {!user && <Lock className="w-3.5 h-3.5 md:w-4 h-4" />}
            Get Started
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="text-center mt-4 text-[10px] md:text-xs text-gray-600">
            Secure payment via Stripe. Cancel anytime.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
