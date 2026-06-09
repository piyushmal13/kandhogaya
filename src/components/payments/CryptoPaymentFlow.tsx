import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Clock,
  Fuel,
  Link2,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import {
  USDT_NETWORKS,
  verifyDepositAddress,
  type CryptoNetwork,
} from "@/config/cryptoAddresses";

interface CryptoPaymentFlowProps {
  amount: number;
  onAddressVerified?: (networkId: string, address: string) => void;
}

type VerificationStep = "select" | "address" | "verify" | "confirmed";

export const CryptoPaymentFlow = ({ amount, onAddressVerified }: CryptoPaymentFlowProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork | null>(null);
  const [step, setStep] = useState<VerificationStep>("select");
  const [copied, setCopied] = useState(false);
  const [addressRevealed, setAddressRevealed] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [addressDoubleChecked, setAddressDoubleChecked] = useState(false);

  // Double-verification: confirm the rendered address matches canonical source
  useEffect(() => {
    if (selectedNetwork) {
      const isValid = verifyDepositAddress(selectedNetwork.id, selectedNetwork.address);
      setAddressDoubleChecked(isValid);
    }
  }, [selectedNetwork]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, []);

  const handleNetworkSelect = (network: CryptoNetwork) => {
    setSelectedNetwork(network);
    setAddressRevealed(false);
    setVerificationInput("");
    setVerificationError(null);
    setStep("address");
  };

  const handleVerifyAddress = () => {
    if (!selectedNetwork) return;
    setIsVerifying(true);
    setVerificationError(null);

    // Double-verification: user must type/paste the exact address to confirm
    const trimmed = verificationInput.trim();
    const canonical = selectedNetwork.address;

    if (trimmed.toLowerCase() !== canonical.toLowerCase()) {
      setVerificationError("Address mismatch. Please paste the exact deposit address you sent funds to.");
      setIsVerifying(false);
      return;
    }

    // Secondary system verification
    const systemVerified = verifyDepositAddress(selectedNetwork.id, canonical);
    if (!systemVerified) {
      setVerificationError("System verification failed. Please contact support immediately.");
      setIsVerifying(false);
      return;
    }

    setStep("confirmed");
    setIsVerifying(false);
    onAddressVerified?.(selectedNetwork.id, canonical);
  };

  const truncateAddress = (addr: string, chars = 8) => {
    if (addr.length <= chars * 2 + 3) return addr;
    return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
  };

  // ─── Step 1: Network Selection ────────────────────────────────────
  if (step === "select") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3 h-3" />
            Cryptographic Settlement
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Select USDT Network
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Choose the network matching your wallet
          </p>
        </div>

        <div className="space-y-3">
          {USDT_NETWORKS.map((network) => (
            <button
              key={network.id}
              onClick={() => handleNetworkSelect(network)}
              className={`w-full p-5 rounded-2xl border transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] ${network.bgColor} ${network.borderColor} hover:border-opacity-60 bg-white/[0.02] hover:bg-white/[0.04]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${network.bgColor} ${network.borderColor} border flex items-center justify-center ${network.color} font-black text-xs`}>
                    {network.icon}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-wider">
                      {network.name}
                    </div>
                    <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                      {network.fullName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Est. Time</div>
                    <div className="text-[10px] text-gray-400 font-mono font-bold">{network.estimatedTime}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[9px] text-amber-400 font-black uppercase tracking-widest">Network Warning</p>
            <p className="text-[9px] text-amber-400/60 font-bold uppercase tracking-wider leading-relaxed">
              Only send USDT on the selected network. Sending on the wrong network will result in permanent loss of funds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 2: Address Display ──────────────────────────────────────
  if (step === "address" && selectedNetwork) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        {/* Network Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("select")}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <div className={`w-9 h-9 rounded-xl ${selectedNetwork.bgColor} ${selectedNetwork.borderColor} border flex items-center justify-center ${selectedNetwork.color} font-black text-[10px]`}>
            {selectedNetwork.icon}
          </div>
          <div>
            <div className="text-sm font-black text-white uppercase tracking-wider">{selectedNetwork.name}</div>
            <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{selectedNetwork.fullName}</div>
          </div>
          {addressDoubleChecked && (
            <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Verified</span>
            </div>
          )}
        </div>

        {/* Amount to Send */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
          <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Send Exactly</div>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-black text-white tracking-tight">${amount}</span>
            <span className={`text-xs font-black uppercase tracking-wider ${selectedNetwork.color}`}>USDT</span>
          </div>
          <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">
            On {selectedNetwork.fullName}
          </div>
        </div>

        {/* Deposit Address */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Deposit Address</div>
            <button
              onClick={() => setAddressRevealed(!addressRevealed)}
              className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
            >
              {addressRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span className="text-[8px] font-bold uppercase tracking-widest">
                {addressRevealed ? "Hide" : "Reveal"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-4 bg-black/40 border border-white/10 rounded-xl font-mono text-sm text-white tracking-wider break-all leading-relaxed">
              {addressRevealed ? selectedNetwork.address : truncateAddress(selectedNetwork.address)}
            </div>
            <button
              onClick={() => handleCopy(selectedNetwork.address)}
              className={`p-4 rounded-xl transition-all active:scale-95 ${
                copied
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : `${selectedNetwork.bgColor} ${selectedNetwork.borderColor} border ${selectedNetwork.color} hover:opacity-80`
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Contract Info */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg">
            <Link2 className="w-3 h-3 text-gray-600" />
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
              Contract: ...{selectedNetwork.contractSuffix}
            </span>
          </div>
        </div>

        {/* Network Details Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
            <Clock className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
            <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Est. Time</div>
            <div className="text-[10px] text-white font-bold mt-0.5">{selectedNetwork.estimatedTime}</div>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
            <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Confirms</div>
            <div className="text-[10px] text-white font-bold mt-0.5">{selectedNetwork.confirmations}</div>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
            <Fuel className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
            <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Gas</div>
            <div className="text-[10px] text-white font-bold mt-0.5">{selectedNetwork.gasFeeNote.split("(")[0].trim()}</div>
          </div>
        </div>

        {/* Verification Prompt */}
        <button
          onClick={() => setStep("verify")}
          className="w-full py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.25em] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          <ShieldCheck className="w-4 h-4" />
          Verify & Confirm Transfer
        </button>

        {/* Safety Warning */}
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[8px] text-amber-400/60 font-bold uppercase tracking-wider leading-relaxed">
            Double-check the network and address before sending. We recommend copying the address and pasting it directly into your wallet. Never type an address manually.
          </p>
        </div>
      </div>
    );
  }

  // ─── Step 3: Double Verification ──────────────────────────────────
  if (step === "verify" && selectedNetwork) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setStep("address")}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Address Verification</h3>
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Double-check security protocol</p>
          </div>
        </div>

        {/* Reference Address Display */}
        <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Verified Destination</span>
          </div>
          <div className="px-4 py-3 bg-black/40 border border-emerald-500/10 rounded-xl font-mono text-xs text-emerald-300 tracking-wider break-all">
            {selectedNetwork.address}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedNetwork.color}`}>
              {selectedNetwork.name} • {selectedNetwork.fullName}
            </span>
            <button
              onClick={() => handleCopy(selectedNetwork.address)}
              className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold uppercase tracking-widest hover:text-emerald-300 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Verification Input */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Confirm Destination Address
            </h4>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
              Paste the exact address from the field above into your wallet, then paste it back here to confirm it matches. This prevents clipboard substitution attacks.
            </p>
          </div>

          <input
            type="text"
            placeholder="PASTE THE DEPOSIT ADDRESS HERE TO VERIFY"
            value={verificationInput}
            onChange={(e) => {
              setVerificationInput(e.target.value);
              setVerificationError(null);
            }}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white text-xs font-mono tracking-wider focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-700"
          />

          {verificationError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[9px] font-black uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {verificationError}
            </div>
          )}
        </div>

        {/* Verification Button */}
        <button
          onClick={handleVerifyAddress}
          disabled={isVerifying || !verificationInput.trim()}
          className="w-full py-5 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.25em] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
        >
          {isVerifying ? (
            <>
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Double-Verify & Confirm
            </>
          )}
        </button>

        <p className="text-[8px] text-white/15 text-center leading-relaxed font-mono uppercase tracking-widest">
          This verification ensures the address in your clipboard matches our verified destination. Never skip this step.
        </p>
      </div>
    );
  }

  // ─── Step 4: Confirmed ────────────────────────────────────────────
  if (step === "confirmed" && selectedNetwork) {
    return (
      <div className="space-y-6 animate-in zoom-in-95 duration-500">
        <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Address Verified</h3>
          <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-widest leading-relaxed">
            The destination address has been double-verified. You may now send your USDT payment.
          </p>
        </div>

        {/* Transfer Summary */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
          <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-3">Transfer Summary</div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Amount</span>
            <span className="text-sm font-black text-white">${amount} USDT</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Network</span>
            <span className={`text-xs font-black uppercase tracking-wider ${selectedNetwork.color}`}>
              {selectedNetwork.name}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Est. Arrival</span>
            <span className="text-xs text-white font-bold">{selectedNetwork.estimatedTime}</span>
          </div>
          <div className="pt-2">
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Destination</div>
            <div className="px-3 py-2 bg-black/40 border border-white/5 rounded-lg font-mono text-[10px] text-white/80 tracking-wider break-all">
              {selectedNetwork.address}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-2">
          <div className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3" />
            Next Steps
          </div>
          <ol className="text-[9px] text-blue-300/50 font-bold uppercase tracking-wider leading-relaxed space-y-1.5 list-decimal list-inside">
            <li>Open your crypto wallet (Binance, Trust Wallet, etc.)</li>
            <li>Withdraw {amount} USDT on the <strong>{selectedNetwork.name}</strong> network</li>
            <li>Paste the verified deposit address above</li>
            <li>Double-check the network matches <strong>{selectedNetwork.fullName}</strong></li>
            <li>Confirm the transaction and wait for {selectedNetwork.confirmations} confirmations</li>
            <li>Take a screenshot of the successful transfer</li>
            <li>Upload the screenshot in the next step for verification</li>
          </ol>
        </div>
      </div>
    );
  }

  return null;
};
