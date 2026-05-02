import { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  CloudUpload,
  Phone
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { tracker } from "@/core/tracker";
import { ReviewPromptModal } from "../ui/ReviewPromptModal";

interface PurchaseModalProps {
  plan: string;
  amount: number;
  productId?: string;
  onClose: () => void;
}

type Step = "payment" | "details" | "upload" | "success";

export const PurchaseModal = ({ plan, amount, productId, onClose }: PurchaseModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("payment");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  const upiId = "piyushmal13@okaxis"; 

  useEffect(() => {
    tracker.track("purchase_attempt", { plan, amount, productId });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Institutional Validation: PNG, JPG, JPEG only. MAX 5MB.
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Institutional Error: Only PNG and JPG formats allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Institutional Error: Payload exceeds 5MB limit.");
      return;
    }

    setFile(selectedFile);
    setStep("upload");
  };

  const handleSubmit = async () => {
    if (!user || !file || !whatsappNumber) {
      setError("Missing institutional metadata. All fields required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. DISCOVERY: Storage Upload
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. DISCOVERY: Register Metadata Signal
      const refCode = localStorage.getItem("ifx_referral_code");
      
      const { error: dbError } = await supabase
        .from("manual_payment_receipts")
        .insert({
          user_id: user.id,
          product_id: productId || null,
          amount: amount,
          storage_path: filePath,
          whatsapp_number: whatsappNumber,
          referred_by_code: refCode,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // 3. FULFILLMENT: Alerting the CEO (WhatsApp Deep Link)
      const encodedMsg = encodeURIComponent(
        `🚨 *REVENUE SIGNAL DETECTED* 🚨\n\n` +
        `👤 *Client:* ${user.email}\n` +
        `📱 *Contact:* ${whatsappNumber}\n` +
        `📦 *Asset:* ${plan}\n` +
        `💰 *Amount:* $${amount}\n` +
        (refCode ? `🔗 *Referral:* ${refCode}\n` : "") +
        `\n🔓 *Audit Required:* Please check the Admin Terminal for verification.`
      );
      
      const whatsappUrl = `https://wa.me/919934661831?text=${encodedMsg}`;
      
      tracker.track("payment_uploaded", { plan, amount, productId });
      
      // Open WhatsApp notification in background
      window.open(whatsappUrl, '_blank');
      
      setStep("success");
      setTimeout(() => setShowReviewPrompt(true), 2000);
    } catch (err: any) {
      console.error("Institutional Failsafe: Purchase Fulfillment Signal Failed.", err);
      setError(err.message || "Institutional connectivity error. Fulfillment discovery halted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[var(--raised)] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden">
        
        {/* Modal Discovery Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">Revenue Fulfillment</div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{plan} Access</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 pt-0">
          {step === "payment" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-center space-y-4 font-mono">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest italic">Capital Requirement</div>
                <div className="text-5xl font-black text-white tracking-tight">${amount}</div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group">
                  <div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter mb-1">UPI Destination</div>
                    <div className="text-lg font-bold text-white tracking-tight">{upiId}</div>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all group-hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  onClick={() => setStep("details")}
                  className="w-full py-5 bg-white text-black font-black text-[10px] uppercase tracking-[.25em] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                >
                  Initiate Verification Flow
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3 italic">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  Communication Link
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="WHATSAPP NUMBER (WITH COUNTRY CODE)"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white text-[10px] font-black tracking-widest focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center italic">
                    Used strictly for fulfillment notification and support.
                  </p>
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-white/10 rounded-[32px] text-center space-y-4 hover:border-emerald-500/50 transition-all group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-2 text-gray-500 group-hover:text-emerald-500 transition-colors">
                    <CloudUpload className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Metadata Artifact</h3>
                    <p className="text-xs text-gray-500">Upload your successful payment artifact</p>
                  </div>
                  <label className="block">
                    <input 
                      type="file" 
                      accept="image/png,image/jpeg,image/jpg" 
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                    <div className="inline-flex px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl cursor-pointer hover:bg-white hover:text-black transition-all">
                      Attach Screenshot
                    </div>
                  </label>
                </div>
                
                <button
                  onClick={() => setStep("payment")}
                  className="w-full py-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Return to Destination
                </button>
            </div>
          )}

          {step === "upload" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-center">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase italic font-black">Ready for Audit</h3>
                <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-widest">{file?.name}</p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest italic">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep("details")}
                  className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all font-mono"
                >
                  Modify
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] px-8 py-5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Auditing Artifact...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Fulfill Subscription
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-8 py-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-500 text-black rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                <ReviewPromptModal isOpen={showReviewPrompt} onClose={() => setShowReviewPrompt(false)} />
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Signal Acknowledged</h2>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Your artifact has been uploaded. An institutional auditor will verify and fulfill your subscription shortly.</p>
              </div>
              <button 
                onClick={onClose}
                className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl"
              >
                Enter Discovery Console
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
