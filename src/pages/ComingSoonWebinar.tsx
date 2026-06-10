import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Clock, Building, Globe, Send, Server, Network } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';

export const ComingSoonWebinar = () => {
  const { success, error: toastError } = useToast();

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [clearanceKey, setClearanceKey] = useState("");
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const savedKey = localStorage.getItem("ifx_webinar_clearance_key");
    const savedName = localStorage.getItem("ifx_webinar_clearance_name");
    if (savedKey && savedName) {
      setIsRegistered(true);
      setClearanceKey(savedKey);
      setRegName(savedName);
    }
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("id, title, image_url, description")
          .eq("placement", "partner")
          .eq("is_active", true)
          .order("priority", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((item) => ({
            name: item.title,
            logo_url: item.image_url
          }));
          setPartners(mapped);
        } else {
          setPartners([
            { name: "MetaTrader 5", logo_url: "/metatrader5.png" },
            { name: "MetaTrader 4", logo_url: "/metatrader4.png" },
            { name: "TradingView", logo_url: "/tradingview.png" },
            { name: "cTrader", logo_url: "/ctrader.png" },
            { name: "Binance", logo_url: "/binance.png" }
          ]);
        }
      } catch (err) {
        console.error("Error fetching partner logos:", err);
        setPartners([
          { name: "MetaTrader 5", logo_url: "/metatrader5.png" },
          { name: "MetaTrader 4", logo_url: "/metatrader4.png" },
          { name: "TradingView", logo_url: "/tradingview.png" },
          { name: "cTrader", logo_url: "/ctrader.png" },
          { name: "Binance", logo_url: "/binance.png" }
        ]);
      }
    };
    fetchPartners();
  }, []);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regName.trim()) return;
    setRegistering(true);

    try {
      const randomKey = "IFX-SEC-" + Math.floor(100000 + Math.random() * 900000);

      const { data: lead } = await supabase
        .from('leads')
        .select('id, score, crm_metadata')
        .eq('email', regEmail)
        .maybeSingle();

      if (!lead) {
        await supabase.from('leads').insert({
          email: regEmail,
          source: 'webinar_coming_soon_pitch',
          score: 15,
          stage: 'INTERESTED',
          last_action_at: new Date().toISOString(),
          crm_metadata: { name: regName, pitch_mode: true, clearance_key: randomKey }
        });
      } else {
        await supabase.from('leads').update({
          score: (lead.score || 0) + 15,
          stage: 'HIGH_INTENT',
          last_action_at: new Date().toISOString(),
          crm_metadata: { 
            ...(lead.crm_metadata || {}), 
            name: regName, 
            pitch_mode: true, 
            clearance_key: randomKey 
          }
        }).eq('id', lead.id);
      }

      await supabase.from('notification_queue').insert({
        recipient: regEmail,
        channel: 'EMAIL',
        priority: 'HIGH',
        payload: {
          message: `Your priority pass for the IFX Trades Institutional Masterclass Series is verified. Clearance Code: ${randomKey}.`,
          user_name: regName,
          action_link: '/webinars'
        },
        status: 'PENDING'
      });

      localStorage.setItem("ifx_webinar_clearance_key", randomKey);
      localStorage.setItem("ifx_webinar_clearance_name", regName);
      setClearanceKey(randomKey);
      setIsRegistered(true);
      success("Priority access requested! Clearance keys queued.");
    } catch (err: any) {
      console.error(err);
      toastError("Clearance dispatch offline. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#030508] overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 sm:py-24 px-4 sm:px-8">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[150%] sm:w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_top,rgba(0,113,227,0.08)_0%,transparent_60%)] blur-[100px] opacity-100" />
        <div className="absolute bottom-0 right-[-20%] w-[80%] sm:w-[60%] h-[50%] bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05)_0%,transparent_60%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />
      </div>

      <div className="w-full max-w-6xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Hero Typography & Info */}
        <div className="lg:col-span-7 space-y-8 sm:space-y-10 text-center lg:text-left flex flex-col items-center lg:items-start mt-8 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            System status: Co-Sponsorship Phase Active
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black tracking-tight uppercase leading-[0.9] text-white"
          >
            Institutional <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#60CDFF] to-emerald-400">Webinar Series</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0"
          >
            The IFX Trades Institutional Webinar Series is launching soon. Get priority clearance keys now to secure your spot and decode volatility with our top-tier execution models.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4"
          >
            {[
              { icon: Server, title: "Compiled Binary Handover", desc: "Deploying secure custom indicator libraries and EX5 modules for direct server integration." },
              { icon: Network, title: "Order Book Liquidity", desc: "Tracking matching engine queue prioritizations directly within Equinix host centers." }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all duration-300 flex flex-col gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <item.icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-wider mb-1.5">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Institutional Integration Partners / Co-Sponsors Row */}
          {partners.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full space-y-4 text-left border-t border-white/5 pt-8"
            >
              <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest block">
                Platform Integration & Masterclass Co-Sponsors
              </span>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {partners.map((partner) => (
                  <div key={partner.name} className="flex items-center gap-2.5 bg-white/[0.01] border border-white/5 pl-2.5 pr-4 py-2 rounded-2xl hover:bg-white/[0.03] transition-all duration-300">
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name} 
                      className="w-6 h-6 rounded-lg object-contain"
                    />
                    <span className="text-[9px] font-black tracking-wider text-zinc-400 uppercase">
                      {partner.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Dynamic Form Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 w-full bg-[#0A0C10]/80 border border-zinc-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-2xl relative shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Building className="w-48 h-48 text-blue-500" />
          </div>
          
          {!isRegistered ? (
            <div className="space-y-8 relative z-10">
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] font-mono">Invite Desk</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Request Access Key</h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Enter your professional credentials below to request invite codes and co-sponsor specifications.
                </p>
              </div>

              <form onSubmit={handleRequestAccess} className="space-y-5">
                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Richard Hendricks"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-zinc-600 focus:bg-black/80 transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Professional Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. r.hendricks@brokerage.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-4 px-5 text-sm text-white outline-none focus:border-zinc-600 focus:bg-black/80 transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={registering}
                  className="w-full py-4 bg-white text-black hover:bg-zinc-200 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer mt-4"
                >
                  {registering ? "Requesting Clearance..." : "Request Priority Access"}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 text-center py-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                <Clock className="w-7 h-7 text-blue-400" />
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-[0.2em] inline-block font-mono">
                  Registration Queued
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Deployment Access Pending</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto font-medium">
                  Hi {regName}, your invitation credentials have been generated and queued for partner database routing.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-black/60 border border-zinc-800 rounded-3xl text-left space-y-3 text-xs mt-6">
                <div className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[9px] font-mono pb-2 border-b border-zinc-800">Clearance Credentials</div>
                <div className="text-zinc-400 flex justify-between items-center pt-2">
                  <span className="text-zinc-500 font-medium">Requestor</span>
                  <span className="font-bold text-white">{regName}</span>
                </div>
                <div className="text-zinc-400 flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Access Key</span>
                  <span className="font-mono text-blue-400 font-black bg-blue-500/10 px-2 py-0.5 rounded-md">{clearanceKey}</span>
                </div>
                <div className="text-zinc-400 flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Status</span>
                  <span className="text-blue-500 font-black flex items-center gap-1.5 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    VALIDATION IN PROGRESS
                  </span>
                </div>
              </div>

              <div className="pt-4 text-[10px] text-zinc-500 font-medium">
                Co-sponsor allocation desk will contact you via email shortly.
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Subtle footer info for full-screen layout */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-6 sm:bottom-10 left-0 right-0 text-center flex flex-col items-center gap-3 z-10"
      >
        <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Equinix SG1/NY4</span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-700"></span>
          <span className="flex items-center gap-1"><Server className="w-3 h-3" /> MT5 Integration</span>
        </div>
      </motion.div>

    </div>
  );
};
