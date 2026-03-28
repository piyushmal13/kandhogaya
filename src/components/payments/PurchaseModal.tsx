import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  CloudUpload
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { submitPaymentProof } from "@/services/apiHandlers";
import { tracker } from "@/core/tracker";

interface PurchaseModalProps {
  plan: string;
  amount: number;
  onClose: () => void;
}

type Step = "payment" | "upload" | "success";

export const PurchaseModal = ({ plan, amount, onClose }: PurchaseModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("payment");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upiId = "piyushmal13@okaxis"; // Institutional UPI Signal

  useEffect(() => {
    tracker.track("purchase_attempt", { plan, amount });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStep("upload");
    }
  };

  const handleSubmit = async () => {
    if (!user || !file) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Storage Verification Signal: Uploading Asset
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Asset Discovery: Get Access Signal
      const { data: { publicUrl } } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(filePath);

      // 3. Fulfillment Signal: Register Proof
      const { success } = await submitPaymentProof(user.id, plan, amount, publicUrl);

      if (success) {
        tracker.track("payment_uploaded", { plan, amount, url: publicUrl });
      } else {
        throw new Error("Fulfillment signal failed. Institutional audit required.");
      }

      setStep("success");
    } catch (err: any) {
      console.error("Institutional Payment Signal Error:", err);
      setError(err.message || "Something went wrong during fulfillment discovery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0A0A0B] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden">
        
        {/* Modal Discovery Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">Subscription Fulfillment</div>
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
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-center space-y-4">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Total Transaction Signal</div>
                <div className="text-5xl font-black text-white tracking-tight">${amount}</div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group">
                  <div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter mb-1">Institutional UPI Discovery</div>
                    <div className="text-lg font-bold text-white tracking-tight">{upiId}</div>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all group-hover:scale-110 active:scale-95"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <div className="p-6 border-2 border-dashed border-white/10 rounded-[32px] text-center space-y-4 hover:border-emerald-500/50 transition-all group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-2 text-gray-500 group-hover:text-emerald-500 transition-colors">
                    <CloudUpload className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Provide Proof Asset</h3>
                    <p className="text-xs text-gray-500">Capture your successful payment signal</p>
                  </div>
                  <label className="block">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                    <div className="inline-flex px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all">
                      Select Verification Screenshot
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === "upload" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-center">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">Ready for Fulfillment</h3>
                <p className="text-sm text-gray-500 mt-2">{file?.name}</p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep("payment")}
                  className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                >
                  Return
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] px-8 py-5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Communicating Signal...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Fulfill Verification
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
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Signal Acknowledged</h2>
                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">Your payment proof has been successfully discovered. An institutional auditor will verify the fulfillment shortly.</p>
              </div>
              <button 
                onClick={onClose}
                className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-110 active:scale-95 transition-all"
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
