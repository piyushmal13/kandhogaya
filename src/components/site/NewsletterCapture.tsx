import React, { useState } from "react";
import { Send, CheckCircle2, Loader2, Mail } from "lucide-react";
import { tracker } from "@/core/tracker";

export const NewsletterCapture = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // Institutional Signal: Lead Captured
      tracker.track("lead_capture", { email, surface: "homepage_newsletter" });
      
      // Simulate API discovery
      await new Promise(r => setTimeout(r, 1200));
      
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Lead Capture discovery failure:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-4 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] animate-in zoom-in-95 duration-500">
        <div className="w-12 h-12 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <div className="text-white font-black uppercase tracking-tight italic">Signal Acknowledged</div>
          <p className="text-emerald-500/70 text-[10px] font-black uppercase tracking-widest mt-1">Intelligence queued for delivery</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-500" />
      <div className="relative flex flex-col md:flex-row items-center gap-4 bg-zinc-950 border border-white/10 p-4 rounded-[32px]">
        <div className="flex-1 flex items-center gap-4 px-6 w-full">
          <Mail className="w-5 h-5 text-gray-500" />
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER INSTITUTIONAL EMAIL..."
            className="bg-transparent border-none outline-none text-white font-black text-[11px] uppercase tracking-widest w-full placeholder:text-gray-700"
            disabled={status === "loading"}
          />
        </div>
        <button 
          type="submit"
          disabled={status === "loading"}
          className="w-full md:w-auto px-10 py-5 bg-emerald-500 text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-[24px] hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Execute Discovery
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
