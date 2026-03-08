import React, { useState, useEffect } from "react";
import { Zap, BarChart3 } from "lucide-react";
import { cn } from "../utils/cn";

export const Signals = () => {
  const [signals, setSignals] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ accuracy: "82.4%", total: 142, pips: "+4,250" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content?type=signal")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSignals(data);
        } else {
          console.error("Failed to load signals:", data);
          setSignals([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load signals", err);
        setSignals([]);
        setLoading(false);
      });
      
    // Mock history for now
    setHistory([
      { id: 1, title: "XAUUSD SELL", result: "TP Hit", pips: "+120", date: "2024-03-06" },
      { id: 2, title: "EURUSD BUY", result: "TP Hit", pips: "+45", date: "2024-03-05" },
      { id: 3, title: "GBPUSD SELL", result: "SL Hit", pips: "-30", date: "2024-03-04" },
    ]);
  }, []);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Signals Dashboard</h1>
          <p className="text-gray-400">Institutional-grade setups from the IFXTrades analyst team.</p>
        </div>
        <div className="flex gap-4">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="bg-zinc-900 border border-white/5 px-4 py-2 rounded-xl">
              <div className="text-[10px] text-gray-500 uppercase font-bold">{key}</div>
              <div className="text-emerald-500 font-bold">{val}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="text-emerald-500 w-5 h-5" /> Live Setups
          </h2>
          {loading ? (
            <div className="text-center py-20 bg-zinc-900 border border-white/10 rounded-2xl">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-gray-500 font-bold">Loading live setups...</div>
            </div>
          ) : signals.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900 border border-white/10 rounded-2xl">
              <Zap className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <div className="text-gray-500 font-bold">No active signals right now.</div>
              <p className="text-gray-600 text-sm">Our analysts are monitoring the markets.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {signals.map((sig: any) => (
                <div key={sig.id} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-white font-bold">{sig.title}</h3>
                      <span className="text-[10px] text-emerald-500 font-bold uppercase">Active Setup</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{new Date(sig.published_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="space-y-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Entry</span>
                      <span className="text-white font-mono">{sig.data?.entry || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Target (TP)</span>
                      <span className="text-emerald-400 font-bold font-mono">{sig.data?.tp || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Risk (SL)</span>
                      <span className="text-red-400 font-mono">{sig.data?.sl || 'N/A'}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => alert("Parameters copied to clipboard!")} className="w-full py-3 bg-emerald-500 text-black text-sm font-bold rounded-xl hover:bg-emerald-400 transition-all">
                    Copy Parameters
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-gray-400 w-5 h-5" /> Performance History
          </h2>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            {history.map((item: any) => (
              <div key={item.id} className="p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-[10px] text-gray-500">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className={cn("text-xs font-bold", item.result === "TP Hit" ? "text-emerald-500" : "text-red-500")}>
                    {item.result}
                  </div>
                  <div className="text-xs text-white font-mono">{item.pips} pips</div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => alert("Loading full track record...")} className="w-full py-3 text-xs text-gray-500 hover:text-white transition-colors">
              View Full Track Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
