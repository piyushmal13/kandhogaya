import React, { useState } from "react";
import { Users, Plus, Search, ExternalLink, Copy, Zap } from "lucide-react";

export const AgentManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const agents = [
    { id: "1", name: "Alex Thompson", code: "alex01", referrals: 142, sales: 42, revenue: 3420, status: "Active" },
    { id: "2", name: "Sarah Miller", code: "sarah_m", referrals: 89, sales: 12, revenue: 1250, status: "Active" },
    { id: "3", name: "David Chen", code: "dchen_fx", referrals: 210, sales: 68, revenue: 8900, status: "Active" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Sales Agent Management</h2>
          <p className="text-gray-500 text-xs">Manage your partner network and track referral performance.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-xs flex items-center gap-2 hover:bg-emerald-400 transition-all">
          <Plus className="w-4 h-4" />
          Add New Agent
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search agents by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs text-gray-500 hover:text-white transition-colors">Export Partners (CSV)</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4">Referral Code</th>
                <th className="px-6 py-4">Referrals</th>
                <th className="px-6 py-4">Total Sales</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xs uppercase">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-white font-medium">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded text-xs">{agent.code}</code>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{agent.referrals}</td>
                  <td className="px-6 py-4 text-gray-400">{agent.sales}</td>
                  <td className="px-6 py-4 text-white font-bold">${agent.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Copy Referral Link">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-emerald-500 transition-colors" title="View Dashboard">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
