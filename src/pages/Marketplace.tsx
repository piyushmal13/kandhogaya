import React, { useState, useEffect } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { cn } from "../utils/cn";
import { AlgoGreatness } from "../components/AlgoGreatness";

export const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Failed to load products:", data);
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
      });
  }, []);

  const handleRequestLicense = (botId: string) => {
    setRequestingId(botId);
    // Simulate API call for license request
    setTimeout(() => {
      setRequestingId(null);
      setSuccessId(botId);
      setTimeout(() => setSuccessId(null), 3000);
    }, 1500);
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Algo Marketplace</h1>
        <p className="text-gray-400">Institutional-grade trading bots for MT5. Rent the edge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.filter((p: any) => p.type === 'algo_bot').map((bot: any) => (
          <div key={bot.id} className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col">
            <div className="aspect-video bg-black relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
              <img src={`https://picsum.photos/seed/${bot.name}/800/450`} alt={bot.name} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute bottom-4 left-6 z-20">
                <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-bold rounded-full uppercase mb-2 inline-block">MT5 Compatible</span>
                <h3 className="text-2xl font-bold text-white">{bot.name}</h3>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-sm line-clamp-2">{bot.description || "Advanced algorithmic trading system optimized for XAUUSD and major forex pairs."}</p>
                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                  <span className="text-[10px] text-emerald-500 font-bold">4.9</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-8 flex-1">
                {bot.variants?.map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer">
                    <div>
                      <div className="text-white font-bold text-sm">{v.name}</div>
                      <div className="text-[10px] text-gray-500">Full License Support</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-500 font-bold">${v.price}</div>
                      <div className="text-[10px] text-gray-500">/ month</div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button"
                onClick={() => handleRequestLicense(bot.id)}
                disabled={requestingId === bot.id || successId === bot.id}
                className={cn(
                  "w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                  successId === bot.id 
                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50" 
                    : "bg-white text-black hover:bg-emerald-500 disabled:opacity-50"
                )}
              >
                {requestingId === bot.id ? (
                  <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                ) : successId === bot.id ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    License Requested
                  </>
                ) : (
                  "Get License Key"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <AlgoGreatness />
    </div>
  );
};
