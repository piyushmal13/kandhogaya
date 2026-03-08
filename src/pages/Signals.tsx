import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Upload, Smartphone, ShieldCheck, Zap, Activity, BarChart3, TrendingUp, Clock, Globe, ArrowRight, Lock, MessageSquare, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

// --- Types ---
type PlanDuration = "1 Month" | "3 Months" | "6 Months";

interface PricingPlan {
  duration: PlanDuration;
  price: number;
  originalPrice?: number;
  savings?: number;
  features: string[];
  popular?: boolean;
  discountApplied?: boolean;
}

// --- Components ---

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-[#000000] pt-20 pb-20">
      {/* --- Institutional Background System --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 1. Ambient Spotlight (Top Center) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_70%)] opacity-60" />

        {/* 2. Large Structural Grid - Static & Stable */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

        {/* 3. Subtle Horizon Glow (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-emerald-900/10 to-transparent opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          LIVE SIGNAL DESK ACTIVE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-tight"
        >
          Professional Trading <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Signals Since 2018
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Institutional-grade trade setups delivered directly to your WhatsApp. Our research desk analyzes the market daily to identify high-probability trading opportunities with precise entry, stop loss, and take profit levels.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          className="group relative px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl overflow-hidden flex items-center gap-2 mx-auto hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
          <span className="relative z-10 flex items-center gap-2">
            Join the Signal Desk
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </div>
    </section>
  );
};

const PerformanceMetrics = () => {
  const metrics = [
    { label: "Pips Generated", value: "48,250+", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Accuracy Rate", value: "82.4%", icon: Activity, color: "text-cyan-400" },
    { label: "Active Traders", value: "12,400+", icon: Users, color: "text-purple-400" },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className={`p-3 rounded-xl bg-white/5 ${metric.color}`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div>
                <div className={`text-3xl font-bold ${metric.color} font-mono`}>{metric.value}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { title: "Market Analysis", desc: "Our research desk analyzes global markets using institutional order flow data.", icon: BarChart3 },
    { title: "Signal Generation", desc: "Trade setups are generated with precise entry, stop loss, and take profit levels.", icon: Zap },
    { title: "Instant Delivery", desc: "Signals are instantly delivered to members via our private WhatsApp channel.", icon: MessageSquare },
  ];

  return (
    <section className="py-24 bg-[#020202]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400">From analysis to execution in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 relative z-10 group-hover:border-emerald-500/50 transition-colors duration-500 shadow-2xl">
                <step.icon className="w-10 h-10 text-emerald-500" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm border-4 border-[#020202]">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SignalPreview = () => {
  return (
    <section className="py-24 bg-[#050505] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Precision Signals. <br /><span className="text-emerald-500">Zero Ambiguity.</span></h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Every signal comes with clear instructions. No "maybe" trades. We provide exact entry zones, multiple take profit levels for scaling out, and a hard stop loss to protect capital.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Daily Trade Setups", "Gold (XAUUSD) Focus", "Forex Major Pairs", 
              "Risk Management Guide", "Market Commentary", "24/7 Support"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Phone Mockup Frame */}
          <div className="w-[320px] mx-auto bg-black border-[8px] border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-20" />
            
            {/* Screen Content */}
            <div className="bg-[#0b141a] h-[600px] w-full flex flex-col">
              {/* Header */}
              <div className="bg-[#202c33] p-4 pt-12 flex items-center gap-3 shadow-md z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">IFX</div>
                <div>
                  <div className="text-white font-medium text-sm">IFXTrades VIP Signals</div>
                  <div className="text-gray-400 text-xs">tap here for group info</div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10">
                
                {/* Date Divider */}
                <div className="flex justify-center">
                  <span className="bg-[#1f2c34] text-[#8696a0] text-[10px] px-3 py-1.5 rounded-lg shadow-sm font-medium">TODAY</span>
                </div>

                {/* Message Bubble */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#202c33] rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-sm relative"
                >
                  <div className="text-[#e9edef] text-sm font-mono leading-relaxed whitespace-pre-line">
                    <span className="font-bold text-emerald-400">⚡ NEW SIGNAL ALERT</span>
                    {"\n\n"}
                    <span className="font-bold">XAUUSD (GOLD) BUY</span>
                    {"\n"}
                    Entry: 2400.50 - 2402.00
                    {"\n\n"}
                    TP 1: 2405.00
                    {"\n"}
                    TP 2: 2410.00
                    {"\n"}
                    TP 3: 2425.00
                    {"\n\n"}
                    SL: 2392.00
                    {"\n\n"}
                    <span className="italic text-xs text-gray-400">Risk: 1-2% per trade. Wait for 15m candle close.</span>
                  </div>
                  <div className="text-[10px] text-[#8696a0] text-right mt-1 flex items-center justify-end gap-1">
                    10:42 AM <Check className="w-3 h-3 text-blue-400" />
                  </div>
                </motion.div>

                {/* Follow up Message */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-[#202c33] rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-sm relative"
                >
                  <div className="text-[#e9edef] text-sm font-mono leading-relaxed">
                    <span className="font-bold text-emerald-400">✅ TP 1 HIT (+45 Pips)</span>
                    {"\n"}
                    Move SL to Breakeven. Secure partial profits.
                  </div>
                  <div className="text-[10px] text-[#8696a0] text-right mt-1 flex items-center justify-end gap-1">
                    11:15 AM <Check className="w-3 h-3 text-blue-400" />
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -right-12 top-1/4 bg-[#202c33] p-4 rounded-xl border border-white/5 shadow-xl hidden md:block">
            <div className="text-emerald-400 font-bold text-2xl">+450 Pips</div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">This Week</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRetentionOffer, setShowRetentionOffer] = useState(false);
  const [hasSeenRetention, setHasSeenRetention] = useState(false);

  const plans: PricingPlan[] = [
    {
      duration: "1 Month",
      price: 20,
      features: ["Daily Signals", "Entry/SL/TP", "Basic Support"],
    },
    {
      duration: "3 Months",
      price: 50,
      originalPrice: 60,
      savings: 10,
      features: ["Daily Signals", "Entry/SL/TP", "Priority Support", "Risk Management Guide"],
      popular: true,
    },
    {
      duration: "6 Months",
      price: 80,
      features: ["Daily Signals", "Entry/SL/TP", "VIP Support", "Risk Management Guide", "1-on-1 Consultation"],
    },
  ];

  const handleJoin = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    // Retention Logic for 6 Month Plan
    if (selectedPlan?.duration === "6 Months" && !hasSeenRetention && !showRetentionOffer) {
      setShowPaymentModal(false);
      setShowRetentionOffer(true);
      setHasSeenRetention(true);
    } else {
      setShowPaymentModal(false);
      setSelectedPlan(null);
    }
  };

  const handleAcceptRetention = () => {
    if (selectedPlan) {
      const discountedPlan = {
        ...selectedPlan,
        price: 56, // $80 - 30% ($24)
        originalPrice: 80,
        savings: 24,
        discountApplied: true
      };
      setSelectedPlan(discountedPlan);
      setShowRetentionOffer(false);
      setShowPaymentModal(true);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#020202] relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">Choose the plan that fits your trading goals.</p>
          <div className="inline-block mt-4 px-4 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold animate-pulse">
            ⚠️ Limited membership slots available for this month
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`relative rounded-3xl p-8 border flex flex-col ${
                plan.popular 
                  ? "bg-[#0a0a0a] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]" 
                  : "bg-[#050505] border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              {plan.duration === "3 Months" && (
                <div className="absolute top-4 right-4 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  SAVE ${plan.savings}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-gray-400 font-medium mb-2">{plan.duration} Access</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-600 line-through">${plan.originalPrice}</span>
                  )}
                </div>
                {plan.duration === "3 Months" && (
                  <p className="text-xs text-emerald-500 mt-2 font-medium">
                    🔥 First month effectively free
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleJoin(plan)}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                  plan.popular
                    ? "bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <PaymentModal plan={selectedPlan} onClose={handleCloseModal} />
        )}
      </AnimatePresence>

      {/* Retention Offer Modal */}
      <AnimatePresence>
        {showRetentionOffer && (
          <RetentionModal onAccept={handleAcceptRetention} onClose={() => setShowRetentionOffer(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const PaymentModal = ({ plan, onClose }: { plan: PricingPlan, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", txnId: "" });
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let screenshotUrl = "";

      // Upload Screenshot
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);
        
        screenshotUrl = publicUrl;
      }

      // Insert Record
      const { error: insertError } = await supabase
        .from('signal_subscriptions')
        .insert([
          {
            user_email: formData.email,
            user_phone: formData.phone,
            plan_duration: plan.duration,
            amount: plan.price,
            transaction_id: formData.txnId,
            screenshot_url: screenshotUrl,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Error submitting payment. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">Complete Your Membership</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Payment Submitted!</h4>
              <p className="text-gray-400 mb-6">
                We have received your payment details. Our team will verify the transaction and add you to the VIP channel within 1-2 hours. You will receive a confirmation email shortly.
              </p>
              <button onClick={onClose} className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Plan Summary */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Selected Plan</div>
                  <div className="text-white font-bold">{plan.duration} Access</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">${plan.price}</div>
                  {plan.discountApplied && <div className="text-xs text-emerald-500">Discount Applied</div>}
                </div>
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Scan QR Code to Pay via UPI</p>
                    <div className="w-48 h-48 bg-white mx-auto rounded-xl flex items-center justify-center mb-4">
                      {/* Placeholder QR */}
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ifxtrades@upi&pn=IFXTrades&am=${plan.price}&cu=USD`} alt="UPI QR" className="w-40 h-40" />
                    </div>
                    <p className="text-xs text-gray-500">UPI ID: ifxtrades@upi</p>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors">
                    I have made the payment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">WhatsApp Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Transaction ID / UTR</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none"
                      value={formData.txnId}
                      onChange={e => setFormData({...formData, txnId: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Payment Screenshot</label>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                      {file ? (
                        <div className="text-emerald-500 text-sm flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> {file.name}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
                          <Upload className="w-6 h-6" />
                          <span>Click to upload screenshot</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10">
                      Back
                    </button>
                    <button type="submit" disabled={uploading} className="flex-1 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-50 flex items-center justify-center gap-2">
                      {uploading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : "Submit Verification"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const RetentionModal = ({ onAccept, onClose }: { onAccept: () => void, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0a0a0a] border border-emerald-500/30 rounded-2xl w-full max-w-md p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
        
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Zap className="w-8 h-8 text-emerald-500" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Wait! Don't Miss Out</h3>
        <p className="text-gray-400 mb-6">
          We really want you to experience the power of our institutional signals. Here is a specialized one-time offer just for you.
        </p>

        <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">6 Months Access</div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl text-gray-500 line-through decoration-red-500">$80</span>
            <ArrowRight className="w-4 h-4 text-gray-500" />
            <span className="text-4xl font-bold text-emerald-400">$56</span>
          </div>
          <div className="text-xs text-emerald-500 font-bold mt-2 uppercase tracking-wider">
            30% OFF • SAVE $24 TODAY
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={onAccept} className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
            Claim 30% Discount
          </button>
          <button onClick={onClose} className="w-full py-3 text-gray-500 hover:text-white text-sm font-medium">
            No thanks, I'll pass on profit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The accuracy is frightening. I've passed two prop firm challenges just using the Gold setups.",
      author: "Rahul M.",
      location: "India",
      avatar: "https://i.pravatar.cc/150?u=rahul"
    },
    {
      quote: "Finally a signal service that gives proper risk management advice. Worth every penny.",
      author: "Sarah J.",
      location: "UK",
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      quote: "The latency is non-existent. As soon as I get the WhatsApp notification, the price is still valid.",
      author: "Ahmed K.",
      location: "Dubai",
      avatar: "https://i.pravatar.cc/150?u=ahmed"
    }
  ];

  return (
    <section className="py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">Trusted by Traders Worldwide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl relative"
            >
              <div className="text-emerald-500 mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full grayscale" />
                <div>
                  <div className="text-white font-bold text-sm">{t.author}</div>
                  <div className="text-gray-500 text-xs">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
          Start Receiving <br /> Professional Signals Today.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            Join WhatsApp Channel
          </button>
          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export const Signals = () => {
  return (
    <div className="bg-[#020202] min-h-screen">
      <HeroSection />
      <PerformanceMetrics />
      <HowItWorks />
      <SignalPreview />
      <PricingSection />
      <Testimonials />
      <FinalCTA />
    </div>
  );
};
