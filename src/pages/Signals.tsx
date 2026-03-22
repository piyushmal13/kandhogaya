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
    className="py-24 border-y border-[var(--border-default)] overflow-hidden"
    style={{ background: "var(--bg-raised)" }}
    aria-labelledby="signal-preview-heading"
  >
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 id="signal-preview-heading" className="text-3xl md:text-5xl font-bold text-white mb-6">
          Precision Signals. <br />
          <span className="site-title-gradient">Zero Ambiguity.</span>
        </h2>
        <p className="text-xl mb-10 leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>
          Every signal is filtered through our quantitative execution engine. We provide
          exact entry zones, algorithmic take-profit structures, and rigid capital protection.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label="Signal features">
          {[
            "Daily Trade Setups",
            "Gold (XAUUSD) Focus",
            "Forex Major Pairs",
            "Risk Management Guide",
            "Market Commentary",
            "24/7 Support",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3" style={{ color: "var(--text-secondary)" }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-subtle)" }}
                aria-hidden="true"
              >
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-sm font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative"
        aria-label="WhatsApp signal preview"
      >
        <motion.div
          whileHover={{ rotateY: -5, rotateX: 5 }}
          className="w-[320px] md:w-[360px] mx-auto bg-black border-[8px] border-zinc-800 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative transition-transform duration-500 ease-out"
          style={{ perspective: "1000px" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-zinc-800 rounded-b-2xl z-20" aria-hidden="true" />
          <div className="bg-[#0b141a] h-[640px] w-full flex flex-col">
            <div className="bg-[#202c33] p-4 pt-12 flex items-center gap-3 shadow-md z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold" aria-hidden="true">
                IFX
              </div>
              <div>
                <div className="text-white font-medium text-sm">IFXTrades VIP Signals</div>
                <div className="text-gray-400 text-xs">tap here for group info</div>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="flex justify-center">
                <span className="bg-[#1f2c34] text-[#8696a0] text-[10px] px-3 py-1.5 rounded-lg font-medium">
                  TODAY
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#202c33] rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-sm"
                role="article"
                aria-label="Trading signal"
              >
                <div className="text-[#e9edef] text-sm font-mono leading-relaxed whitespace-pre-line">
                  <span className="font-bold text-emerald-400">⚡ NEW SIGNAL ALERT{"\n\n"}</span>
                  <span className="font-bold">XAUUSD (GOLD) BUY{"\n"}</span>
                  Entry: 2400.50 - 2402.00{"\n\n"}
                  TP 1: 2405.00{"\n"}TP 2: 2410.00{"\n"}TP 3: 2425.00{"\n\n"}
                  SL: 2392.00{"\n\n"}
                  <span className="italic text-xs text-gray-400">
                    Risk: 1-2% per trade. Wait for 15m candle close.
                  </span>
                </div>
                <div className="text-[10px] text-[#8696a0] text-right mt-1 flex items-center justify-end gap-1">
                  10:42 AM <Check className="w-3 h-3 text-blue-400" aria-hidden="true" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-[#202c33] rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-sm"
              >
                <div className="text-[#e9edef] text-sm font-mono leading-relaxed">
                  <span className="font-bold text-emerald-400">✅ TP 1 HIT (+45 Pips){"\n"}</span>
                  Move SL to Breakeven. Secure partial profits.
                </div>
                <div className="text-[10px] text-[#8696a0] text-right mt-1 flex items-center justify-end gap-1">
                  11:15 AM <Check className="w-3 h-3 text-blue-400" aria-hidden="true" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 top-1/4 backdrop-blur-2xl p-6 rounded-3xl border border-[var(--border-default)] shadow-[var(--shadow-float)] hidden lg:block z-30"
          style={{ background: "rgba(15,26,46,0.85)" }}
          aria-hidden="true"
        >
          <div className="text-emerald-400 font-bold text-4xl mb-1">+450</div>
          <div className="text-xs uppercase tracking-widest font-mono mb-3" style={{ color: "var(--text-muted)" }}>
            Pips Captured
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="h-full bg-emerald-400"
            />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 40, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-12 bottom-1/4 backdrop-blur-2xl p-5 rounded-3xl border border-[var(--border-default)] shadow-[var(--shadow-float)] hidden lg:flex items-center gap-4 z-30"
          style={{ background: "rgba(15,26,46,0.85)" }}
          aria-hidden="true"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">94%</div>
            <div className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Accuracy
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ── Payment Modal ──
const PaymentModal = ({ plan, onClose }: { plan: PricingPlan; onClose: () => void }) => {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", txnId: "" });
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.full_name || "", email: user.email || "" }));
    }
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
                    <label className="block text-xs mb-1 font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Payment Screenshot
                    </label>
                    <div className="border-2 border-dashed rounded-[var(--radius-input)] p-4 text-center hover:border-[var(--accent)]/50 transition-colors cursor-pointer relative" style={{ borderColor: "var(--border-default)" }}>
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
                    </div>
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
        style={{ background: "linear-gradient(to right, var(--accent), #74e0ff)" }}
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
      className="py-24 relative"
      style={{ background: "var(--bg-base)" }}
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: "var(--text-muted)" }}>Choose the plan that fits your trading goals.</p>
          <div
            className="inline-block mt-4 px-4 py-1 rounded-full text-xs font-bold animate-pulse"
            style={{ background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.2)", color: "#fca5a5", border: "1px solid" }}
            role="alert"
            aria-live="polite"
          >
            ⚠️ Limited membership slots available for this month
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.duration}
              whileHover={{ y: -10 }}
              className="relative rounded-3xl p-8 border flex flex-col"
              style={{
                background: plan.popular ? "var(--bg-raised)" : "var(--bg-surface)",
                borderColor: plan.popular ? "var(--accent)" : "var(--border-default)",
                boxShadow: plan.popular ? "0 0 30px rgba(88,242,182,0.15)" : undefined,
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
                  style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                  aria-label="Most popular plan"
                >
                  MOST POPULAR
                </div>
              )}

              {plan.savings && (
                <div
                  className="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded border"
                  style={{ color: "var(--accent)", background: "var(--accent-subtle)", borderColor: "rgba(88,242,182,0.2)" }}
                >
                  SAVE ${plan.savings}
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                  {plan.duration} Access
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>
                      ${plan.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1" aria-label={`${plan.duration} plan features`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleJoin(plan)}
                className="w-full py-4 rounded-[var(--radius-button)] font-bold transition-all duration-300"
                style={
                  plan.popular
                    ? { background: "var(--accent)", color: "var(--accent-fg)" }
                    : { background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid var(--border-default)" }
                }
                aria-label={`Join ${plan.duration} plan for $${plan.price}`}
              >
                Join Now
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
    className="py-24 relative overflow-hidden"
    style={{ background: "var(--bg-base)" }}
    aria-labelledby="final-cta-heading"
  >
    <div
      className="absolute inset-0 blur-[100px] pointer-events-none opacity-30"
      style={{ background: "var(--accent-subtle)" }}
      aria-hidden="true"
    />
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 id="final-cta-heading" className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
        Start Receiving <br /> Professional Signals Today.
      </h2>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-4 font-bold rounded-[var(--radius-button)] flex items-center justify-center gap-2 transition-colors"
          style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
        >
          <Smartphone className="w-5 h-5" aria-hidden="true" />
          Join WhatsApp Channel
        </button>
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-4 font-bold rounded-[var(--radius-button)] border border-[var(--border-default)] transition-colors hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.05)", color: "white" }}
        >
          View Pricing
        </button>
      </div>
    </div>
  </section>
);

// ── Page ──
export const Signals = () => (
  <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
    <PageMeta
      title="Live Trading Signals"
      description="Access IFXTrades live signal workflows — institutional-grade forex and gold signals with exact entry, stop loss, and take profit. Join 12,400+ traders."
      path="/signals"
      keywords={[
        "forex signals",
        "gold signals",
        "live trading signals",
        "XAUUSD signals",
        "WhatsApp trading signals",
        "forex signal service",
      ]}
      structuredData={[
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Signals", path: "/signals" },
        ]),
        faqSchema([
          {
            question: "How are IFXTrades signals delivered?",
            answer: "Signals are delivered instantly via a private WhatsApp channel with exact entry, stop loss, and take profit levels for gold (XAUUSD) and major forex pairs.",
          },
          {
            question: "What is the accuracy rate of IFXTrades signals?",
            answer: "Our signals maintain an 82.4% win rate based on trailing twelve-month performance data, with a profit factor of 3.24.",
          },
          {
            question: "How much do the signal plans cost?",
            answer: "Plans start at $20/month for 1-month access, $50 for 3 months, and $80 for 6 months. All plans include daily signals with exact entry, SL, and TP levels.",
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
