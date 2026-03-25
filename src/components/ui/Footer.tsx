import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";

import { BRANDING } from "../../constants/branding";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/5 pt-32 pb-20 bg-[#020202]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="bg-[#050505] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <Link to="/" className="flex items-center gap-5 group">
            <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-white/[0.02] p-2 group-hover:bg-white/[0.05] transition-all duration-700">
              <img src={BRANDING.logoUrl} alt="IFXTrades Logo" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.3em] text-white uppercase">{BRANDING.name}</div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-sans font-medium mt-1">Institutional Surface</div>
            </div>
          </Link>

          <p className="mt-8 text-base leading-relaxed text-gray-400 font-sans font-light opacity-80">
            {BRANDING.description}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={BRANDING.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm text-gray-300 hover:border-[#83ffc8]/20 transition-all duration-700"
            >
              <span className="inline-flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-[#83ffc8] opacity-60" />
                WhatsApp Desk
              </span>
              <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-[#83ffc8] transition-colors" />
            </a>
            <a
              href={`mailto:${BRANDING.supportEmail}`}
              className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm text-gray-300 hover:border-[#83ffc8]/20 transition-all duration-700"
            >
              <span className="inline-flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#83ffc8] opacity-60" />
                Support
              </span>
              <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-[#83ffc8] transition-colors" />
            </a>
          </div>
        </div>

        <div className="p-4">
          <h4 className="mb-8 text-xs font-semibold uppercase tracking-[0.4em] text-white opacity-40">Protocols</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-sans font-medium uppercase tracking-[0.1em]">
            <li><Link to="/signals" className="hover:text-[#83ffc8] transition-colors">Live Signals</Link></li>
            <li><Link to="/marketplace" className="hover:text-[#83ffc8] transition-colors">Algo Matrix</Link></li>
            <li><Link to="/results" className="hover:text-[#83ffc8] transition-colors">Audit Logs</Link></li>
            <li><Link to="/login" className="hover:text-[#83ffc8] transition-colors">Terminal Access</Link></li>
          </ul>
        </div>

        <div className="p-4">
          <h4 className="mb-8 text-xs font-semibold uppercase tracking-[0.4em] text-white opacity-40">Intelligence</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-sans font-medium uppercase tracking-[0.1em]">
            <li><Link to="/courses" className="flex items-center gap-3 hover:text-[#83ffc8] transition-colors"><BookOpen className="h-4 w-4" /> Academy</Link></li>
            <li><Link to="/blog" className="flex items-center gap-3 hover:text-[#83ffc8] transition-colors"><Activity className="h-4 w-4" /> Insights</Link></li>
            <li><Link to="/about" className="flex items-center gap-3 hover:text-[#83ffc8] transition-colors"><Shield className="h-4 w-4" /> Firm</Link></li>
            <li><Link to="/hiring" className="flex items-center gap-3 hover:text-[#83ffc8] transition-colors"><Users className="h-4 w-4" /> Lab</Link></li>
          </ul>
        </div>

        <div className="bg-[#050505] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#83ffc8] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#83ffc8]"></span>
            </div>
            <span className="text-xs font-semibold tracking-[0.4em] text-[#83ffc8] uppercase">Nodes Active</span>
          </div>
          <div className="space-y-6 text-sm text-gray-400 font-sans font-medium">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="uppercase tracking-widest text-[10px] opacity-60">Execution Latency</span>
              <span className="text-white">12ms</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="uppercase tracking-widest text-[10px] opacity-60">Uptime Protocol</span>
              <span className="text-white">99.99%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="uppercase tracking-widest text-[10px] opacity-60">Region</span>
              <span className="inline-flex items-center gap-3 text-white"><Globe className="h-4 w-4 text-[#83ffc8] opacity-60" /> Global</span>
            </div>
            <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-xs leading-relaxed text-gray-500 font-light italic">
              Proprietary execution infrastructure optimized for HFT signal generation and algorithmic licensing.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-8 border-t border-white/5 pt-12 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 text-[10px] text-gray-600 font-sans font-medium uppercase tracking-[0.2em] md:flex-row md:items-center opacity-60">
          <span>&copy; 2026 {BRANDING.name}.</span>
          <span className="hidden h-1 w-1 rounded-full bg-gray-800 md:block" />
          <span>Institutional Grade Execution Surface.</span>
        </div>

        <div className="flex flex-wrap gap-8 text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em]">
          <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
            <Shield className="w-3 h-3" /> Privacy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-2">
            <FileText className="w-3 h-3" /> Terms
          </Link>
          <Link to="/risk" className="hover:text-white transition-colors flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" /> Risk
          </Link>
          <Link to="/cookies" className="hover:text-white transition-colors">
            Cookies
          </Link>
        </div>
      </div>

      <div className="mt-12 border-t border-white/5 pt-8 text-[11px] leading-relaxed text-gray-700 font-sans font-medium max-w-5xl">
        RISK DISCLOSURE: Trading financial instruments involves significant risk of loss. Our signals and algorithms are for informational and educational purposes only. Past performance is not indicative of future results. Please trade responsibly with capital you can afford to lose.
      </div>
    </div>
  </footer>
);
