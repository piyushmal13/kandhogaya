import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ArrowRight, ShieldCheck, Activity, BarChart3, TrendingUp, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AlgoDetailModalProps {
  algo: any;
  onClose: () => void;
  onSubscribe: (algo: any, plan: 'Monthly' | 'Yearly') => void;
}

const data = [
  { name: 'Jan', equity: 10000 },
  { name: 'Feb', equity: 10500 },
  { name: 'Mar', equity: 11200 },
  { name: 'Apr', equity: 10800 },
  { name: 'May', equity: 11500 },
  { name: 'Jun', equity: 12100 },
  { name: 'Jul', equity: 12800 },
  { name: 'Aug', equity: 13500 },
  { name: 'Sep', equity: 14200 },
  { name: 'Oct', equity: 15000 },
  { name: 'Nov', equity: 15800 },
  { name: 'Dec', equity: 16500 },
];

export const AlgoDetailModal = ({ algo, onClose, onSubscribe }: AlgoDetailModalProps) => {
  const [plan, setPlan] = useState<'Monthly' | 'Yearly'>('Yearly');

  const monthlyPrice = algo.monthly_price;
  const yearlyPrice = algo.yearly_price;
  const savings = (monthlyPrice * 12) - yearlyPrice;

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
        className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-white/10 transition-colors text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left: Details & Chart */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto border-r border-white/5">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest mb-4">
              <Zap className="w-3 h-3" />
              {algo.strategy_type}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{algo.name}</h2>
            <p className="text-gray-400 leading-relaxed text-lg">{algo.description}</p>
          </div>

          {/* Performance Chart */}
          <div className="mb-10">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Equity Growth (Backtest)
            </h3>
            <div className="h-[300px] w-full bg-white/5 rounded-xl border border-white/5 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value}`, 'Equity']}
                  />
                  <Line type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Strategy Features</h4>
              <ul className="space-y-2">
                {algo.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Risk Profile</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Risk Level</div>
                  <div className={`text-sm font-bold ${
                    algo.risk_level === 'High' ? 'text-red-400' : 
                    algo.risk_level === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>{algo.risk_level}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                  <div className="text-sm font-bold text-white">{algo.win_rate}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Supported Assets</div>
                  <div className="text-sm text-white">{algo.supported_assets?.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Subscription */}
        <div className="w-full md:w-[400px] bg-[#050505] p-8 md:p-12 flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          
          <h3 className="text-2xl font-bold text-white mb-6">Select Plan</h3>

          {/* Toggle */}
          <div className="flex bg-black p-1 rounded-xl mb-8 border border-white/10">
            <button 
              onClick={() => setPlan('Monthly')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${plan === 'Monthly' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setPlan('Yearly')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all relative ${plan === 'Yearly' ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-white'}`}
            >
              Yearly
              <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-bounce">
                SAVE 30%
              </span>
            </button>
          </div>

          {/* Price Display */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">
              ${plan === 'Monthly' ? monthlyPrice : yearlyPrice}
            </div>
            <div className="text-gray-500 text-sm">
              per {plan === 'Monthly' ? 'month' : 'year'}
            </div>
            {plan === 'Yearly' && (
              <div className="mt-4 inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
                <span className="text-emerald-400 text-sm font-bold">You save ${savings} per year</span>
              </div>
            )}
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" />
              Full Algorithm Access
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" />
              24/7 VPS Hosting Included
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-300">
              <Check className="w-4 h-4 text-emerald-500" />
              Priority Support
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              30-Day Money Back Guarantee
            </li>
          </ul>

          <button 
            onClick={() => onSubscribe(algo, plan)}
            className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 group"
          >
            Subscribe Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="text-center mt-4 text-xs text-gray-600">
            Secure payment via Stripe. Cancel anytime.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
