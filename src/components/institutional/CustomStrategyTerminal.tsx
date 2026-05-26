import React, { useState } from 'react';
import { Code2, Cpu, Terminal, Send, ShieldCheck, Database, Loader2, CheckCircle2 } from 'lucide-react';
import { leadService } from '../../services/crm/leadService';
import { useToast } from '../../contexts/ToastContext';

export const CustomStrategyTerminal = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [framework, setFramework] = useState("Python (Quantitative Analysis)");
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { error: errorToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !brief) {
      errorToast("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    try {
      const result = await leadService.createLead({
        email: email,
        source: "custom_algo_engineering_desk",
        stage: "HIGH_INTENT",
        crm_metadata: {
          full_name: name,
          target_framework: framework,
          engineering_brief: brief,
          requested_at: new Date().toISOString()
        }
      });

      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error("Engineering request failed:", err);
      errorToast(err.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-cyan-500/[0.03] to-transparent border border-white/5 overflow-hidden group">
      {/* Background Graphic Decorator */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none hidden lg:block" aria-hidden="true">
        <Terminal className="w-48 h-48 text-cyan-400" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative z-10 items-center">
        
        {/* Left Side: Institutional Scope */}
        <div className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-[0.25em] w-fit">
             Elite Engineering Desk
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none italic uppercase">
             Elite <br />
             <span className="text-cyan-500">Engineering.</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed font-medium max-w-lg">
             Our institutional desk houses senior quantitative development teams. From sovereign algorithmic frameworks to high-velocity execution bridges, we engineer bespoke technology.
          </p>

          {/* Space-Saving Horizontal Row Badges instead of vertical stack */}
          <div className="flex flex-wrap gap-2.5 pt-2">
             {[
               { icon: Code2, label: "Bespoke Logic" },
               { icon: Database, label: "API Hardening" },
               { icon: Cpu, label: "Quant Devs" }
             ].map((item) => (
               <div key={item.label} className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/50 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5">
                 <item.icon className="w-3 h-3 text-cyan-500/60" />
                 {item.label}
               </div>
             ))}
          </div>
        </div>

        {/* Right Side: Tightly Arranged Form */}
        <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-3xl shadow-2xl relative">
           {!success ? (
             <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                   <div className="space-y-1">
                      <label htmlFor="req-name" className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">Request Origin</label>
                      <input 
                        id="req-name"
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white/[0.01] border border-white/10 rounded-lg py-2 px-3.5 text-xs text-white placeholder:text-white/20 focus:border-cyan-500/30 transition-all outline-none" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label htmlFor="req-email" className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">Secure Email</label>
                      <input 
                        id="req-email"
                        type="email" 
                        placeholder="email@address.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/[0.01] border border-white/10 rounded-lg py-2 px-3.5 text-xs text-white placeholder:text-white/20 focus:border-cyan-500/30 transition-all outline-none" 
                      />
                   </div>
                </div>

                <div className="space-y-1">
                   <label htmlFor="req-framework" className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">Target Framework</label>
                   <select 
                     id="req-framework"
                     value={framework}
                     onChange={(e) => setFramework(e.target.value)}
                     className="w-full bg-white/[0.01] border border-white/10 rounded-lg py-2 px-3.5 text-xs text-white focus:border-cyan-500/30 transition-all outline-none appearance-none cursor-pointer"
                   >
                      <option className="bg-[#070A0F]" value="Python (Quantitative Analysis)">Python (Quantitative Analysis)</option>
                      <option className="bg-[#070A0F]" value="MQL5 (Execution Protocols)">MQL5 (Execution Protocols)</option>
                      <option className="bg-[#070A0F]" value="PineScript (Discovery Engines)">PineScript (Discovery Engines)</option>
                   </select>
                </div>

                <div className="space-y-1">
                   <label htmlFor="req-brief" className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">Engineering Brief</label>
                   <textarea 
                     id="req-brief"
                     rows={2} 
                     placeholder="Describe the deep coding requirement..." 
                     value={brief}
                     onChange={(e) => setBrief(e.target.value)}
                     required
                     className="w-full bg-white/[0.01] border border-white/10 rounded-lg py-2 px-3.5 text-xs text-white placeholder:text-white/20 focus:border-cyan-500/30 transition-all outline-none resize-none"
                   />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.25em] bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50"
                >
                   {loading ? (
                     <>
                       <Loader2 className="w-3.5 h-3.5 animate-spin" />
                       Transmitting Signal...
                     </>
                   ) : (
                     <>
                       <Send className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                       Initiate Engineering Request
                     </>
                   )}
                </button>
                
                <div className="flex items-center justify-center gap-1.5 pt-1">
                   <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                   <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">End-to-End Encryption Protocol Active</p>
                </div>
             </form>
           ) : (
             <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-500">
               <div className="w-14 h-14 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                 <CheckCircle2 className="w-7 h-7" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-base font-black text-white uppercase tracking-tight italic">Signal Transmitted</h3>
                 <p className="text-gray-400 text-[10px] uppercase tracking-wider leading-relaxed max-w-xs mx-auto">
                   Your bespoke engineering brief has been successfully ingested into our secure ledger.
                 </p>
               </div>
               <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-[8px] text-cyan-400 font-mono tracking-wider max-w-xs mx-auto leading-relaxed">
                  A senior quantitative lead will contact you on your secure email or WhatsApp within 4 hours.
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
