import React from "react";
import { X, ExternalLink, Star } from "lucide-react";

export const ReviewPromptModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
   // Assuming a simple z-index overlay since we don't know the exact `<Dialog>` spec yet
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
        
        <div className="relative w-full max-w-md bg-[var(--color6)] border border-white/5 rounded-[40px] p-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
           
           <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
             <X className="w-5 h-5" />
           </button>

           <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mb-8">
              <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" />
           </div>

           <h3 className="text-2xl font-black text-white italic tracking-tight mb-4">
             Finding value in our macro research?
           </h3>
           <p className="text-sm text-gray-400 leading-relaxed font-sans mb-10">
             Your feedback builds unparalleled trust. Drop a quick 5-star review on Google to help us onboard more elite traders globally.
           </p>

           <div className="flex flex-col gap-4">
             {/* Google Review Redirect */}
             <a
               href="https://g.page/r/cfxxxxxx/review"
               target="_blank"
               rel="noopener noreferrer"
               onClick={onClose}
               className="w-full h-14 flex items-center justify-center gap-3 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-gray-200 transition-all group"
             >
                Review on Google 
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
             </a>
             
             {/* Support / WhatsApp Redirect */}
             <a
               href="https://wa.me/1234567890?text=I%20just%20left%20a%205%20star%20review!"
               target="_blank"
               rel="noopener noreferrer"
               onClick={onClose}
               className="w-full h-14 flex items-center justify-center gap-3 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-xl hover:bg-emerald-400 transition-all"
             >
                Notify Admin via WhatsApp
             </a>
             
             <button onClick={onClose} className="mt-4 text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-white transition-colors">
               Remind me later
             </button>
           </div>
        </div>
      </div>
   );
};
