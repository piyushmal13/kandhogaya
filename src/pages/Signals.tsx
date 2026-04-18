import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Upload, Smartphone, Activity, ArrowRight, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Link } from "react-router-dom";
import { WebinarPromoInline } from "../components/webinars/WebinarPromoInline";
import { PageMeta } from "../components/site/PageMeta";
import { SignalsHero } from "../components/signals/SignalsHero";
import { LiveSignalsFeed } from "../components/signals/LiveSignalsFeed";
import { PerformanceMetrics } from "../components/signals/PerformanceMetrics";
import { HowItWorks } from "../components/signals/HowItWorks";
import { SignalTestimonials } from "../components/signals/SignalTestimonials";
import { breadcrumbSchema, faqSchema } from "../utils/structuredData";

// ── Types ──
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

// ── Signal Preview Section ──
const SignalPreview = () => (
  <section
    className="py-32 md:py-48 px-6 bg-[#020202] border-y border-white/[0.05] relative overflow-hidden"
    aria-labelledby="signal-preview-heading"
  >
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full opacity-10 -z-10" />

    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div>
        <motion.h2 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-shimmer mb-10"
        >
          Precision Signals. <br />
          <span className="italic font-serif text-gradient-emerald">Zero Ambiguity.</span>
        </motion.h2>
        <p className="text-lg text-gray-400 mb-12 font-light leading-relaxed max-w-xl">
          Every signal is filtered through our quantitative execution engine. We provide
          exact entry zones, algorithmic take-profit structures, and rigid capital protection.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8" aria-label="Signal features">
          {[
            "Daily Trade Setups",
            "Gold (XAUUSD) Focus",
            "Forex Major Pairs",
            "Risk Management Guide",
            "Market Commentary",
            "24/7 Support",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 italic">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative"
      >
        <motion.div
          whileHover={{ rotateY: -10, rotateX: 5 }}
          className="w-[320px] md:w-[380px] mx-auto bg-[#020202] border-[12px] border-white/[0.05] rounded-[4rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.8)] relative transition-all duration-1000 ease-out group"
          style={{ perspective: "2000px" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-white/[0.05] rounded-b-3xl z-20" />
          <div className="bg-[#080B12] h-[680px] w-full flex flex-col relative">
            <div className="bg-[#0C0F18]/80 backdrop-blur-xl p-6 pt-14 flex items-center gap-4 border-b border-white/[0.05] z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black italic shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                IFX
              </div>
              <div>
                <div className="text-white font-black uppercase tracking-widest text-[10px] italic">IFX Research VIP</div>
                <div className="text-emerald-500/40 text-[9px] font-black uppercase tracking-widest mt-0.5 animate-pulse">Synchronized</div>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="flex justify-center">
                <span className="bg-white/[0.03] text-white/20 text-[8px] px-4 py-2 rounded-xl font-black uppercase tracking-widest border border-white/[0.05]">
                  Live Stream: Today
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-[#0C0F18] border border-white/[0.08] rounded-[2rem] rounded-tl-none p-6 max-w-[90%] shadow-2xl"
              >
                <div className="text-white/80 text-[11px] font-mono leading-relaxed whitespace-pre-line uppercase tracking-widest">
                  <span className="font-black text-emerald-500 italic">⚡ NODE EXECUTION{"\n\n"}</span>
                  <span className="font-black text-white italic">XAUUSD BUY{"\n"}</span>
                  Entry: 2400.50 - 2402.00{"\n\n"}
                  TP 1: 2405.00{"\n"}TP 2: 2410.00{"\n"}TP 3: 2425.00{"\n\n"}
                  SL: 2392.00{"\n\n"}
                  <span className="italic text-[9px] text-white/20 font-black">
                    Audit: 1-2% Risk. Wait for H1 Confirm.
                  </span>
                </div>
                <div className="text-[9px] text-white/20 text-right mt-4 flex items-center justify-end gap-2 font-black">
                  10:42 UTC <Check className="w-3 h-3 text-emerald-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[2rem] rounded-tl-none p-6 max-w-[90%] shadow-2xl"
              >
                <div className="text-emerald-500 text-[11px] font-mono leading-relaxed uppercase tracking-widest">
                  <span className="font-black italic">✅ ALPHA TARGET 1 HIT{"\n"}</span>
                  Yield: +45 Pips. SL to BE.
                </div>
                <div className="text-[9px] text-emerald-500/40 text-right mt-4 flex items-center justify-end gap-2 font-black">
                  11:15 UTC <Check className="w-3 h-3 text-emerald-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating Badges */}
        <motion.div
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-12 top-1/4 p-8 rounded-[2.5rem] border border-white/[0.08] bg-[#0C0F18]/80 backdrop-blur-3xl shadow-2xl hidden lg:block z-30"
        >
          <div className="text-emerald-500 font-black text-5xl mb-2 italic tracking-tighter">+450</div>
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">Points Realized</div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-12 bottom-1/4 p-6 rounded-[2.5rem] border border-white/[0.08] bg-[#0C0F18]/80 backdrop-blur-3xl shadow-2xl hidden lg:flex items-center gap-6 z-30"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 flex items-center justify-center">
            <Activity className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <div className="text-white font-black text-2xl italic tracking-tighter">94%</div>
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">Execution Fidelity</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ── Payment Modal ──
const PaymentModal = ({ plan, onClose }: { plan: PricingPlan; onClose: () => void }) => {
  const { user, userProfile } = useAuth();
  const { error: toastError } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", txnId: "" });
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: userProfile?.full_name || "", email: user.email || "" }));
    }
  }, [user, userProfile]);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="site-panel w-full max-w-md p-8 text-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-required-title"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--accent-subtle)" }}>
            <Lock className="w-8 h-8 text-emerald-400" aria-hidden="true" />
          </div>
          <h3 id="auth-required-title" className="text-2xl font-bold text-white mb-2">Authentication Required</h3>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Please log in to your account to join the Signal Desk and complete your membership.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-[var(--radius-button)] font-bold transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", color: "white" }}
            >
              Cancel
            </button>
            <Link
              to="/login"
              className="flex-1 py-3 rounded-[var(--radius-button)] font-bold text-center transition-colors"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Log In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    try {
      let screenshotUrl = "";
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("payment-proofs").upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("payment-proofs").getPublicUrl(fileName);
        screenshotUrl = publicUrl;
      }
      const { error: insertError } = await supabase
        .from("payment-proofs")
        .insert([{ user_id: user.id, amount: plan.price, proof_url: screenshotUrl, status: "pending" }]);
      if (insertError) throw insertError;
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toastError("Error submitting payment. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const inputClass = "w-full border border-[var(--border-default)] rounded-[var(--radius-input)] px-4 py-3 text-white outline-none transition-colors focus:border-[var(--accent)]/50";
  const inputStyle = { background: "rgba(0,0,0,0.5)" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="site-panel w-full max-w-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
      >
        <div className="flex justify-between items-center p-6 border-b border-[var(--border-default)]">
          <h3 id="payment-modal-title" className="text-xl font-bold text-white">Complete Your Membership</h3>
          <button
            onClick={onClose}
            className="transition-colors hover:text-white"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--accent-subtle)" }}>
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Payment Submitted!</h4>
              <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                We've received your payment details. Our team will verify and add you to the VIP channel within 1–2 hours.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-[var(--radius-button)] font-bold"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div
                className="rounded-[var(--radius-input)] p-4 mb-6 flex justify-between items-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div>
                  <div className="text-sm" style={{ color: "var(--text-muted)" }}>Selected Plan</div>
                  <div className="text-white font-bold">{plan.duration} Access</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">${plan.price}</div>
                  {plan.discountApplied && <div className="text-xs text-emerald-400">Discount Applied</div>}
                </div>
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="mb-4" style={{ color: "var(--text-muted)" }}>Scan QR Code to Pay via UPI</p>
                    <div className="w-48 h-48 bg-white mx-auto rounded-[var(--radius-input)] flex items-center justify-center mb-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ifxtrades@upi&pn=IFXTrades&am=${plan.price}&cu=USD`}
                        alt="UPI QR Code for payment"
                        className="w-40 h-40"
                      />
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>UPI ID: ifxtrades@upi</p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-[var(--radius-button)] font-bold transition-colors"
                    style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                  >
                    I have made the payment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(
                    [
                      { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                      { label: "Email Address", key: "email", type: "email", placeholder: "john@example.com" },
                      { label: "WhatsApp Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
                      { label: "Transaction ID / UTR", key: "txnId", type: "text", placeholder: "XXXXXXXXXXXX" },
                    ] as const
                  ).map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs mb-1 font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                        {label}
                      </label>
                      <input
                        required
                        type={type}
                        className={inputClass}
                        style={inputStyle}
                        placeholder={placeholder}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      />
                    </div>
                  ))}

                  <div>
                    <span className="block text-xs mb-1 font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Payment Screenshot
                    </span>
                    <label className="border-2 border-dashed rounded-[var(--radius-input)] p-4 text-center hover:border-[var(--accent)]/50 transition-colors cursor-pointer relative block" style={{ borderColor: "var(--border-default)" }}>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required aria-label="Upload payment screenshot" />
                      {file ? (
                        <div className="text-emerald-400 text-sm flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" aria-hidden="true" /> {file.name}
                        </div>
                      ) : (
                        <div className="text-sm flex flex-col items-center gap-2" style={{ color: "var(--text-muted)" }}>
                          <Upload className="w-6 h-6" aria-hidden="true" />
                          <span>Click to upload screenshot</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 rounded-[var(--radius-button)] font-bold transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", color: "white" }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 py-3 rounded-[var(--radius-button)] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                    >
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Submit Verification"
                      )}
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

// ── Retention Modal ──
const RetentionModal = ({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="site-panel w-full max-w-md p-8 text-center relative overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="retention-modal-title"
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ background: "linear-gradient(to right, var(--accent), var(--color46))" }}
        aria-hidden="true"
      />

      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" style={{ background: "var(--accent-subtle)" }}>
        <ArrowRight className="w-8 h-8 text-emerald-400" aria-hidden="true" />
      </div>

      <h3 id="retention-modal-title" className="text-2xl font-bold text-white mb-2">Wait! Don't Miss Out</h3>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        We really want you to experience the power of our institutional signals. Here is a one-time offer just for you.
      </p>

      <div className="rounded-[var(--radius-input)] p-4 mb-8 border border-[var(--border-default)]" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>6 Months Access</div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl line-through" style={{ color: "var(--text-muted)" }}>$80</span>
          <ArrowRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <span className="text-4xl font-bold text-emerald-400">$56</span>
        </div>
        <div className="text-xs text-emerald-400 font-bold mt-2 uppercase tracking-wider">
          30% OFF • SAVE $24 TODAY
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onAccept}
          className="w-full py-3 rounded-[var(--radius-button)] font-bold transition-colors"
          style={{ background: "var(--accent)", color: "var(--accent-fg)", boxShadow: "var(--shadow-glow)" }}
        >
          Claim 30% Discount
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-medium transition-colors hover:text-white"
          style={{ color: "var(--text-muted)" }}
        >
          No thanks, I'll pass on profit
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Pricing Section ──
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
      setSelectedPlan({ ...selectedPlan, price: 56, originalPrice: 80, savings: 24, discountApplied: true });
      setShowRetentionOffer(false);
      setShowPaymentModal(true);
    }
  };

  return (
    <section
      id="pricing"
      className="py-32 md:py-48 bg-[#020202] relative overflow-hidden"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            id="pricing-heading" 
            className="text-shimmer mb-8 text-center"
          >
            Sovereign <br />
            <span className="italic font-serif text-gradient-emerald">Membership.</span>
          </motion.h2>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">Choose the plan that fits your trading goals.</p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block mt-12 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-500 text-black shadow-[0_10px_30px_rgba(16,185,129,0.3)] italic"
            role="alert"
          >
            ⚠️ Restricted Nodes: Limited capacity for this cycle
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.duration}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className={cn(
                "relative rounded-[3.5rem] p-12 border flex flex-col transition-all duration-700 group",
                plan.popular 
                  ? "bg-emerald-500/[0.03] border-emerald-500/30 shadow-[0_40px_80px_rgba(16,185,129,0.1)] scale-[1.05] z-10" 
                  : "bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.02] hover:border-white/[0.15]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] italic">
                  MOST POPULAR
                </div>
              )}

              {Boolean(plan.savings) && (
                <div className="absolute top-8 right-8 text-[8px] font-black px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 uppercase tracking-widest italic">
                  SAVE ${plan.savings}
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-xl font-black text-white/40 mb-4 uppercase tracking-[0.3em] italic">
                  {plan.duration}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-emerald-500/40 uppercase tracking-widest">$</span>
                  <span className="text-6xl font-black text-white tracking-tighter tabular-nums italic">{plan.price}</span>
                  {Boolean(plan.originalPrice) && (
                    <span className="text-2xl line-through text-white/10 ml-3 italic" style={{ textDecorationThickness: '2px' }}>
                      ${plan.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-6 mb-12 flex-1" aria-label={`${plan.duration} plan features`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/50">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleJoin(plan)}
                className={cn(
                  "w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 italic",
                  plan.popular 
                    ? "bg-white text-black hover:scale-[1.02] shadow-[0_20px_40px_rgba(255,255,255,0.1)]" 
                    : "bg-white/5 text-white hover:bg-white/10 hover:scale-[1.02]"
                )}
              >
                Execute Access
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <PaymentModal plan={selectedPlan} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRetentionOffer && (
          <RetentionModal onAccept={handleAcceptRetention} onClose={() => setShowRetentionOffer(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

// ── Final CTA ──
const FinalCTA = () => (
  <section
    className="py-48 md:py-64 relative overflow-hidden bg-[#020202]"
    aria-labelledby="final-cta-heading"
  >
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full opacity-20" />
    </div>

    <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
      <motion.h2 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        id="final-cta-heading" 
        className="text-shimmer mb-16 text-center leading-[0.9]"
      >
        Start Receiving <br />
        <span className="italic font-serif text-gradient-emerald">Sovereign Signals.</span>
      </motion.h2>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-center gap-8"
      >
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="px-12 py-6 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl bg-white text-black hover:scale-[1.05] transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] italic flex items-center justify-center gap-4"
        >
          <Smartphone className="w-5 h-5" />
          Join WhatsApp Desk
        </button>
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="px-12 py-6 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl border border-white/[0.08] text-white hover:bg-white/[0.04] transition-all duration-500 italic"
        >
          View Pricing
        </button>
      </motion.div>
    </div>
  </section>
);

// ── Page ──
export const Signals = () => (
  <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
    <PageMeta
      title="Quantitative Model Alerts"
      description="Access IFXTrades model workflows — institutional-grade forex and gold setups with exact entry, stop loss, and take profit for educational demonstration. Join 12,400+ members."
      path="/signals"
      keywords={[
        "quantitative models",
        "educational signals",
        "algo trading workflows",
        "institutional research",
        "market setups",
      ]}
      structuredData={[
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Signals", path: "/signals" },
        ]),
        faqSchema([
          {
            question: "How are IFXTrades workflows delivered?",
            answer: "Educational model alerts are delivered instantly via a private WhatsApp channel with exact entry, stop loss, and take profit zones.",
          },
          {
            question: "What is the fidelity rate of IFXTrades models?",
            answer: "Our models maintain an 82.4% historical simulation fidelity based on trailing twelve-month performance data.",
          },
          {
            question: "How much do the signal plans cost?",
            answer: "Plans start at $20/month for 1-month access, $50 for 3 months, and $80 for 6 months. All plans include daily educational setups.",
          },
        ]),
      ]}
    />
    <SignalsHero />
    <LiveSignalsFeed />
    <PerformanceMetrics />
    <HowItWorks />
    <SignalPreview />
    <div className="max-w-7xl mx-auto px-4 mb-16">
      <WebinarPromoInline />
    </div>
    <PricingSection />
    <SignalTestimonials />
    <FinalCTA />
  </div>
);
