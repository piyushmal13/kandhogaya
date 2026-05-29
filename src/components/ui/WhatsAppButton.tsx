import React, { useState, useEffect, useRef } from "react";
import { Send, X, ShieldAlert, CheckCheck, Smartphone } from "lucide-react";
import { BRANDING } from "../../constants/branding";

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Clear notification indicator on first open
  useEffect(() => {
    if (isOpen) {
      setHasNotification(false);
    }
  }, [isOpen]);

  // Click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleQuickConnect = (promptText: string) => {
    const encoded = encodeURIComponent(`📱 *Institutional Inquiry:* ${promptText}`);
    const whatsappUrl = `${BRANDING.whatsappUrl}?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans" ref={panelRef}>
      {/* 1. Closed State: Pulsing Floating Button with Notification Alert */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-emerald-500 text-black p-3.5 sm:p-4 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-110 active:scale-95 hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all flex items-center justify-center group cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          {hasNotification && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-black/20"></span>
            </span>
          )}

          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          <span className="absolute right-full mr-4 bg-zinc-900 text-white text-xs font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl">
            Chat with Support
          </span>
        </button>
      )}

      {/* 2. Open State: Elegant Mini Drawer Support Terminal */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-[320px] sm:w-[350px] bg-[#0c0f12] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* macOS Desktop Header Bar */}
          <div className="bg-[#181d22] px-3.5 py-2 flex items-center border-b border-white/5 relative shrink-0">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
                IFX Secure Support Node
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="ml-auto z-10 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Support Widget Active Chat Header */}
          <div className="bg-[#202c33] p-3.5 border-b border-white/5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black tracking-wider text-xs shadow-inner relative">
                IFX
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#202c33] rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  IFX Sovereign Desk
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </h3>
                <p className="text-[7px] font-bold text-emerald-400 tracking-widest uppercase">PING &lt;1.2ms (NODE ACTIVE)</p>
              </div>
            </div>
            <Smartphone className="w-4 h-4 text-white/30" />
          </div>

          {/* Support Chat Message body */}
          <div 
            className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[260px] bg-[#0b141a]" 
            style={{ backgroundImage: 'radial-gradient(#1c2c36 1px, transparent 1px)', backgroundSize: '12px 12px' }}
          >
            {/* System Node Secure Alert */}
            <div className="flex justify-center">
              <div className="bg-[#182229] border border-white/5 rounded-lg px-2.5 py-1 text-[7px] font-black uppercase tracking-widest text-[#8696a0] flex items-center gap-1.5 shadow-sm">
                <ShieldAlert className="w-3 h-3 text-emerald-500" />
                SECURE END-TO-END TELEMETRY ACTIVE
              </div>
            </div>

            {/* Support Message Bubble */}
            <div className="flex flex-col items-start gap-1 w-full pr-4 select-none">
              <div className="bg-[#202c33] text-white p-3 rounded-2xl rounded-tl-none border border-white/5 shadow-md relative text-left">
                <div className="absolute top-0 left-[-5px] w-0 h-0 border-t-[7px] border-t-[#202c33] border-l-[7px] border-l-transparent" />
                <p className="text-[10px] text-white/90 leading-relaxed font-sans font-medium">
                  Welcome to the <strong>IFX Trades Quantitative Desk</strong>. We can compile MT5 binary packages, trigger sandbox license keys, or optimize routing latency immediately. 
                </p>
                <p className="text-[10px] text-emerald-400 font-bold mt-1.5">
                  Select an institutional quick action below:
                </p>
                <div className="flex items-center gap-1 justify-end mt-1 text-[6px] text-white/20 font-bold font-mono">
                  <span>Active Node</span>
                </div>
              </div>
            </div>

            {/* Quick Action Prompt Options */}
            <div className="space-y-1.5 pt-1.5 pl-2 select-none">
              <button 
                onClick={() => handleQuickConnect("Request Sandboxed MT5 Binary compilation")}
                className="w-full text-left bg-[#182229] hover:bg-[#1f2c34] border border-white/5 hover:border-emerald-500/30 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider text-emerald-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>📦 Request Sandbox Binary</span>
                <Send className="w-2.5 h-2.5 opacity-55" />
              </button>
              
              <button 
                onClick={() => handleQuickConnect("Connect with Senior Quantitative Lead")}
                className="w-full text-left bg-[#182229] hover:bg-[#1f2c34] border border-white/5 hover:border-emerald-500/30 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider text-emerald-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>📱 Connect with Senior Lead</span>
                <Send className="w-2.5 h-2.5 opacity-55" />
              </button>

              <button 
                onClick={() => handleQuickConnect("Optimize Telemetry server latency link")}
                className="w-full text-left bg-[#182229] hover:bg-[#1f2c34] border border-white/5 hover:border-emerald-500/30 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider text-emerald-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>⚡ Optimize Execution Ping</span>
                <Send className="w-2.5 h-2.5 opacity-55" />
              </button>
            </div>
          </div>

          {/* Support Widget Action Input Footer */}
          <div className="bg-[#1c272e] p-3 border-t border-white/5 flex flex-col gap-2 shrink-0">
            <button
              onClick={() => handleQuickConnect("General Institutional Support Request")}
              className="w-full bg-emerald-500 text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              Start Secure WhatsApp Chat
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
