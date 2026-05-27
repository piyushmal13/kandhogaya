import React, { useState } from "react";
import { motion } from "motion/react";
import { X, CheckCircle2, Loader2, AlertCircle, Shield, Globe, Award, Zap, User, Mail, Phone, ChevronRight } from "lucide-react";
import { Product } from "../../types";
import { leadService } from "../../services/crm/leadService";

interface TrialRegistrationModalProps {
  algo: Product;
  onClose: () => void;
}

export const TrialRegistrationModal = ({ algo, onClose }: TrialRegistrationModalProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !location || !experience) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const refCode = localStorage.getItem("ifx_referral_code");

    try {
      const result = await leadService.createLead({
        email: email,
        source: "marketplace_demo_request",
        stage: "HIGH_INTENT",
        referred_by_code: refCode || undefined,
        crm_metadata: {
          full_name: fullName,
          phone_number: phone,
          location: location,
          trading_experience: experience,
          requested_trial_for_id: algo.id,
          requested_trial_for_name: algo.name,
          trial_requested_at: new Date().toISOString(),
          trial_days: 7,
          client_time: new Date().toLocaleTimeString()
        }
      });

      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error("Lead submission failed:", err);
      setError(err.message || "Failed to submit demo request. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-[#070A0F] border border-white/10 rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
 
        <div className="p-8 sm:p-10">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono tracking-widest uppercase">
                  <Zap className="w-3 h-3" />
                  Instant Sandbox Provisioning
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic">
                  Request {algo.name} Demo
                </h2>
                <p className="text-xs text-white/40 leading-relaxed max-w-md">
                  Experience professional quantitative automation. Provide your institutional parameters below to provision a complimentary 7-day compiled sandbox key.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest italic animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Form Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text"
                      placeholder="FULL NAME"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 pl-11 text-white text-[10px] font-bold tracking-wider placeholder:text-white/20 focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 pl-11 text-white text-[10px] font-bold tracking-wider placeholder:text-white/20 focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="tel"
                      placeholder="TELEPHONE (WITH COUNTRY CODE)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 pl-11 text-white text-[10px] font-bold tracking-wider placeholder:text-white/20 focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text"
                      placeholder="GEOGRAPHICAL LOCATION"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 pl-11 text-white text-[10px] font-bold tracking-wider placeholder:text-white/20 focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Experience Dropdown */}
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <select 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3.5 pl-11 text-white text-[10px] font-bold tracking-wider focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#070A0F] text-white/20">TRADING EXPERIENCE LEVEL</option>
                    <option value="Beginner (< 1 Year)" className="bg-[#070A0F] text-white">BEGINNER (&lt; 1 YEAR)</option>
                    <option value="Intermediate (1-3 Years)" className="bg-[#070A0F] text-white">INTERMEDIATE (1-3 YEARS)</option>
                    <option value="Professional (3+ Years)" className="bg-[#070A0F] text-white">PROFESSIONAL (3+ YEARS)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-[0.25em] rounded-2xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Allocating Sandbox Server...
                    </>
                  ) : (
                    <>
                      Request Complimentary Trial
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[8px] text-white/20 uppercase font-bold tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-emerald-500/40" />
                  Secured &amp; Sandboxed. Your details are never sold or shared.
                </div>
              </div>

            </form>
          ) : (
            <div className="space-y-8 py-10 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-500 text-black rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 className="w-12 h-12 animate-bounce" />
              </div>
              
              <div className="space-y-4 max-w-sm mx-auto">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Sandbox Allocated</h2>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                  Your complimentary 7-day systematic demo license is successfully queued for creation!
                </p>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-[9px] text-emerald-400 font-mono tracking-wider leading-relaxed">
                  An institutional quantitative strategist will contact you on WhatsApp / Email within 12 hours with your sandboxed MT5/MT4 compilation, license activation key, and complete parameter setup guide.
                </div>
              </div>

              <button 
                onClick={onClose}
                className="px-12 py-4.5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Close Console
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
