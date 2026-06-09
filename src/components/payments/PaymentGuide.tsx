import { useState } from "react";
import {
  Wallet,
  ArrowRight,
  Copy,
  Check,
  Camera,
  Upload,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Monitor,
  QrCode,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { USDT_NETWORKS, type CryptoNetwork } from "@/config/cryptoAddresses";

interface GuideStep {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  details?: string[];
  warning?: string;
}

const PAYMENT_STEPS: GuideStep[] = [
  {
    number: 1,
    title: "Choose Payment Method",
    description: "Select UPI for instant bank transfers or USDT (Crypto) for blockchain settlement.",
    icon: Wallet,
    details: [
      "UPI: Processed via PhonePe, GPay, Paytm — instant confirmation",
      "Crypto: Send USDT on BSC, TRX, ETH, or TON network",
      "All methods require screenshot proof after payment",
    ],
  },
  {
    number: 2,
    title: "Copy the Deposit Address",
    description: "For crypto: select your preferred network, then copy the exact deposit address. For UPI: copy the UPI ID shown.",
    icon: Copy,
    details: [
      "Always use the copy button — never type addresses manually",
      "For crypto: make sure you select the CORRECT network in your wallet",
      "The address changes per network — double-check before sending",
    ],
    warning: "Sending crypto on the wrong network (e.g., ERC20 to TRC20) will permanently lose your funds.",
  },
  {
    number: 3,
    title: "Send the Exact Amount",
    description: "Transfer the exact dollar amount shown. For crypto, send USDT (not any other token).",
    icon: ArrowRight,
    details: [
      "Only send USDT — other tokens like USDC, BUSD will not be credited",
      "Send the exact amount displayed in the payment modal",
      "Gas/network fees are separate — ensure you have enough for both",
      "Wait for the required number of blockchain confirmations",
    ],
  },
  {
    number: 4,
    title: "Take a Screenshot",
    description: "Capture the full successful transaction screen from your wallet or payment app.",
    icon: Camera,
    details: [
      "Include the transaction hash/ID in the screenshot",
      "Show the sending address, receiving address, and amount",
      "Show the 'Success' or 'Confirmed' status clearly",
      "For UPI: screenshot the payment success screen with reference number",
      "File format: PNG or JPG only, max 5MB",
    ],
  },
  {
    number: 5,
    title: "Upload & Submit",
    description: "Upload your screenshot and provide your WhatsApp number for fulfillment notification.",
    icon: Upload,
    details: [
      "Only PNG and JPG formats accepted (max 5MB)",
      "Your WhatsApp number is used only for delivery confirmation",
      "Our team verifies each payment manually for security",
      "You'll receive confirmation via WhatsApp once verified",
    ],
  },
  {
    number: 6,
    title: "Access Granted",
    description: "Once verified, you'll receive immediate access to your purchased product or subscription.",
    icon: CheckCircle2,
    details: [
      "Typical verification time: 5-30 minutes during business hours",
      "You'll get a WhatsApp message with access details",
      "For downloadable products, you'll get a direct download link",
      "For subscriptions, your dashboard access will be activated",
    ],
  },
];

export const PaymentGuide = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [copiedNetwork, setCopiedNetwork] = useState<string | null>(null);

  const handleCopyAddress = async (network: CryptoNetwork) => {
    try {
      await navigator.clipboard.writeText(network.address);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = network.address;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedNetwork(network.id);
    setTimeout(() => setCopiedNetwork(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">
          <Smartphone className="w-3 h-3" />
          Payment Guide
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tight">
          How to Complete Your Purchase
        </h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-md mx-auto">
          Follow these steps carefully. If you have any issues, contact support via WhatsApp.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {PAYMENT_STEPS.map((step) => {
          const isExpanded = expandedStep === step.number;
          const Icon = step.icon;

          return (
            <div
              key={step.number}
              className={`rounded-2xl border transition-all duration-300 ${
                isExpanded
                  ? "bg-white/[0.03] border-white/10"
                  : "bg-white/[0.01] border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.number)}
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isExpanded
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                    : "bg-white/5 border border-white/5 text-gray-500"
                }`}>
                  {isExpanded ? <Icon className="w-4 h-4" /> : (
                    <span className="text-xs font-black">{step.number}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-black uppercase tracking-wider transition-colors ${
                    isExpanded ? "text-white" : "text-gray-400"
                  }`}>
                    {step.title}
                  </div>
                  {!isExpanded && (
                    <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider mt-0.5 truncate">
                      {step.description}
                    </div>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed pl-13">
                    {step.description}
                  </p>

                  {step.details && (
                    <ul className="space-y-2 pl-13">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500/40 shrink-0 mt-0.5" />
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.warning && (
                    <div className="ml-13 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-[8px] text-amber-400/60 font-bold uppercase tracking-wider leading-relaxed">
                        {step.warning}
                      </span>
                    </div>
                  )}

                  {/* Show all deposit addresses on Step 2 */}
                  {step.number === 2 && (
                    <div className="mt-4 space-y-2 pl-13">
                      <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-2">All Deposit Addresses</div>
                      {USDT_NETWORKS.map((network) => (
                        <div
                          key={network.id}
                          className={`p-3 ${network.bgColor} ${network.borderColor} border rounded-xl flex items-center gap-3`}
                        >
                          <div className={`w-7 h-7 rounded-lg ${network.bgColor} ${network.borderColor} border flex items-center justify-center ${network.color} font-black text-[8px]`}>
                            {network.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{network.name}</div>
                            <div className="text-[9px] text-white/60 font-mono tracking-wider truncate">{network.address}</div>
                          </div>
                          <button
                            onClick={() => handleCopyAddress(network)}
                            className={`p-2 rounded-lg transition-all active:scale-95 ${
                              copiedNetwork === network.id
                                ? "bg-emerald-500 text-black"
                                : "bg-white/5 border border-white/5 text-gray-500 hover:text-white"
                            }`}
                          >
                            {copiedNetwork === network.id ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Screenshot guide on Step 4 */}
                  {step.number === 4 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 pl-13">
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center space-y-2">
                        <Smartphone className="w-5 h-5 text-emerald-500/40 mx-auto" />
                        <div className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Mobile Wallet</div>
                        <div className="text-[8px] text-emerald-400/40 font-bold uppercase tracking-wider leading-relaxed">
                          Screenshot the success screen showing tx hash & amount
                        </div>
                      </div>
                      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-center space-y-2">
                        <Monitor className="w-5 h-5 text-blue-500/40 mx-auto" />
                        <div className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Desktop Exchange</div>
                        <div className="text-[8px] text-blue-400/40 font-bold uppercase tracking-wider leading-relaxed">
                          Capture the withdrawal confirmation with full details
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
