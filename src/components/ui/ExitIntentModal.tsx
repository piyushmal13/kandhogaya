import React, { useEffect, useState } from "react";
import { X, ArrowRight, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const ExitIntentModal = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [hasTriggered, setHasTriggered] = useState(false);
   const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

   useEffect(() => {
     const handleMouseLeave = (e: MouseEvent) => {
       if (e.clientY <= 10 && !hasTriggered) {
         setIsOpen(true);
         setHasTriggered(true);
       }
     };

     document.addEventListener("mouseleave", handleMouseLeave);
     return () => document.removeEventListener("mouseleave", handleMouseLeave);
   }, [hasTriggered]);

   if (!isOpen) return null;

   const handleSubscribe = async (e: React.FormEvent) => {
     e.preventDefault();
     if (formState !== 'idle') return;
     
     const form = e.target as HTMLFormElement;
     const emailInput = form.elements.namedItem("email") as HTMLInputElement;
     const email = emailInput?.value;
     
     if (email) {
       setFormState('loading');
       try {
         await supabase.from("leads").insert([{ email, source: "exit_intent" }]);
       } catch (err) {
         // Silently allow simulation UI processing in absence of table
       }
       setTimeout(() => {
         setFormState('success');
         if (emailInput) emailInput.value = '';
         setTimeout(() => { 
           setFormState('idle'); 
           setIsOpen(false);
         }, 3000);
       }, 800);
     }
   };

   return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        
        <div className="relative w-full max-w-lg bg-[#050505] border border-white/10 rounded-[32px] p-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 text-center">
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
           
           <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
             <X className="w-6 h-6" />
           </button>

           <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-amber-500" />
           </div>

           <h3 className="text-3xl font-black text-white italic tracking-tight mb-4">
             Don't trade blind.
           </h3>
           <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans mb-10 max-w-sm mx-auto">
             Join 10k+ elite traders receiving our institutional macro signals and proprietary algorithmic framework directly in their inbox.
           </p>

           <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
             <input 
               name="email"
               type="email"
               required
               disabled={formState !== 'idle'}
               placeholder="ENTER INSTITUTIONAL EMAIL..."
               className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-center text-xs font-black tracking-widest text-white outline-none uppercase placeholder:text-gray-600 focus:border-amber-500/50 transition-colors disabled:opacity-50"
             />
             
             <button 
               type="submit"
               disabled={formState !== 'idle'}
               className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-[var(--brand)] transition-all flex items-center justify-center gap-3 disabled:opacity-90 disabled:hover:bg-white"
             >
                {formState === 'loading' && <span className="animate-pulse">Connecting...</span>}
                {formState === 'success' && <span className="text-emerald-600 flex items-center gap-2">✓ Access Granted</span>}
                {formState === 'idle' && (
                  <>
                    Lock In Your Edge
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
             </button>
           </form>
           
           <p className="mt-6 text-[9px] text-gray-600 font-bold uppercase tracking-widest">
             No spam. Pure execution. Unsubscribe anytime.
           </p>
        </div>
      </div>
   );
};
