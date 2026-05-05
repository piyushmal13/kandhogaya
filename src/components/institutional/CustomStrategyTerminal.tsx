import React from 'react';
import { Code2, Cpu, Terminal, Send, ShieldCheck, Database } from 'lucide-react';

export const CustomStrategyTerminal = () => {
  return (
    <div className="relative p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-cyan-500/[0.03] to-transparent border border-white/5 overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Terminal className="w-64 h-64 text-cyan-400" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em]">
             Engineering Desk
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight italic uppercase">
             Elite <br />
             <span className="text-cyan-500">Engineering.</span>
          </h2>
          <p className="text-lg text-white/40 leading-relaxed font-medium">
             Our institutional desk houses the industry's most senior quantitative development teams. We engineer bespoke algorithmic infrastructure, high-velocity execution protocols, and proprietary signal logic for sophisticated market participants.
          </p>

          <div className="space-y-4">
             {[
               { icon: Code2, label: "Python / MQL5 / PineScript Expert", id: "tech-1" },
               { icon: Database, label: "High-Frequency API Integration", id: "tech-2" },
               { icon: Cpu, label: "Proprietary Algorithm Hardening", id: "tech-3" }
             ].map((item) => (
               <div key={item.id} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                     <item.icon className="w-4 h-4 text-cyan-500/60" />
                  </div>
                  {item.label}
               </div>
             ))}
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-3xl shadow-2xl">
           <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label htmlFor="req-origin" className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Request Origin</label>
                    <input id="req-origin" type="text" placeholder="Full Name" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:border-cyan-500/30 transition-all outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label htmlFor="secure-email" className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Secure Email</label>
                    <input id="secure-email" type="email" placeholder="email@address.com" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:border-cyan-500/30 transition-all outline-none" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label htmlFor="target-framework" className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Target Framework</label>
                 <select id="target-framework" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:border-cyan-500/30 transition-all outline-none appearance-none">
                    <option>Python (Quantitative)</option>
                    <option>MQL5 (Execution)</option>
                    <option>PineScript (Discovery)</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label htmlFor="eng-brief" className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Engineering Brief</label>
                 <textarea id="eng-brief" rows={4} placeholder="Describe the deep coding requirement..." className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:border-cyan-500/30 transition-all outline-none resize-none"></textarea>
              </div>

              <button type="button" className="w-full py-5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_10px_40px_rgba(6,182,212,0.3)] active:scale-95 flex items-center justify-center gap-3">
                 <Send className="w-4 h-4" />
                 Initiate Engineering Request
              </button>
              
              <div className="flex items-center justify-center gap-2 pt-2">
                 <ShieldCheck className="w-3 h-3 text-emerald-500" />
                 <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">End-to-End Encryption Protocol Active</p>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};
