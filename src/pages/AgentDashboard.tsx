import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BarChart3, Users, ShoppingCart, Zap, Copy, ExternalLink, TrendingUp, DollarSign } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getAgentStats } from "../services/apiHandlers";
import { motion } from "motion/react";

/**
 * Agent Dashboard
 * Limited dashboard for sales agents to track their referrals and commissions.
 * Restricted to users with the 'agent' role.
 */
export const AgentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user && (user.user_metadata?.role === 'agent' || user.user_metadata?.role === 'admin')) {
      const fetchStats = async () => {
        const agentCode = user.user_metadata?.agent_code || user.id.slice(0, 8);
        const data = await getAgentStats(agentCode);
        setStats(data);
        setLoading(false);
      };
      fetchStats();
    }
  }, [user]);

  const isAgent = user?.user_metadata?.role === 'agent' || user?.user_metadata?.role === 'admin';
  if (!user || !isAgent) return <Navigate to="/dashboard" />;

  const agentCode = user.user_metadata?.agent_code || user.id.slice(0, 8);
  const referralLink = `${window.location.origin}?agent=${agentCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="pt-32 text-center text-white">Loading Agent Data...</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Agent Partner Portal</h1>
          <p className="text-gray-500 text-sm">Track your performance and manage your referral network.</p>
        </div>
        
        <div className="bg-zinc-900 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1">
            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Your Referral Link</div>
            <div className="text-white font-mono text-xs truncate max-w-[200px] md:max-w-xs">{referralLink}</div>
          </div>
          <button 
            onClick={copyToClipboard}
            className="p-3 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            {copied ? <Zap className="w-5 h-5 fill-current" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Referrals", value: stats.referrals, icon: Users, color: "text-emerald-500" },
          { label: "Total Sales", value: stats.totalSales, icon: ShoppingCart, color: "text-emerald-500" },
          { label: "Revenue Generated", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-500" },
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${s.color}`}>
              <s.icon className="w-16 h-16" />
            </div>
            <s.icon className={`${s.color} w-6 h-6 mb-6`} />
            <div className="text-4xl font-bold text-white mb-2 tracking-tighter">{s.value}</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Recent Activity
              </h3>
            </div>
            <div className="p-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Detailed sales analytics will appear here as your network grows.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 rounded-3xl border border-emerald-500/20">
            <h3 className="text-white font-bold mb-4">Partner Support</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Need help with your referral strategy or have questions about commissions? Our partner desk is here to help.</p>
            <button className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
              Contact Partner Desk
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
            <h3 className="text-white font-bold mb-6">Quick Resources</h3>
            <ul className="space-y-4">
              {["Marketing Assets", "Commission Structure", "Agent Guidelines"].map((item, i) => (
                <li key={i} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{item}</span>
                  <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-emerald-500 transition-all" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
