import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  FileText,
  Mail,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";

import { BRANDING } from "../../constants/branding";
import { ResizedImage } from "./ResizedImage";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/5 pt-32 pb-20 bg-[#020202]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="bg-[#050505] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <Link to="/" className="flex items-center gap-5 group">
            <div className="flex items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/[0.04] p-0 transition-all duration-700 group-hover:bg-white/[0.08] group-hover:scale-105 border border-white/5 group-hover:border-[var(--brand)]/20 shadow-2xl h-12 w-12 sm:h-14 sm:w-14">
              <ResizedImage
                src={BRANDING.logoUrl}
                alt={`${BRANDING.name} Logo`}
                className="h-full w-full object-cover"
              />
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
              className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm text-gray-300 hover:border-[var(--brand)]/20 transition-all duration-700"
            >
              <span className="inline-flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-[var(--brand)] opacity-60" />
                WhatsApp Desk
              </span>
              <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-[var(--brand)] transition-colors" />
            </a>
            <a
              href={`mailto:${BRANDING.supportEmail}`}
              className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-sm text-gray-300 hover:border-[var(--brand)]/20 transition-all duration-700"
            >
              <span className="inline-flex items-center gap-3">
                <Mail className="h-4 w-4 text-[var(--brand)] opacity-60" />
                Support
              </span>
              <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-[var(--brand)] transition-colors" />
            </a>
          </div>
        </div>

        <div className="p-4">
          <h4 className="mb-8 text-xs font-semibold uppercase tracking-[0.4em] text-white opacity-40">Execution Protocols</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-sans font-medium uppercase tracking-[0.1em]">
            <li><Link to="/signals" className="hover:text-[var(--brand)] transition-colors">Live Signals</Link></li>
            <li><Link to="/marketplace" className="hover:text-[var(--brand)] transition-colors">Algo Marketplace</Link></li>
            <li><Link to="/results" className="hover:text-[var(--brand)] transition-colors">Performance Audit</Link></li>
            <li><Link to="/login" className="hover:text-[var(--brand)] transition-colors">Institutional Terminal</Link></li>
          </ul>
        </div>

        <div className="p-4">
          <h4 className="mb-8 text-xs font-semibold uppercase tracking-[0.4em] text-white opacity-40">Intelligence Desk</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-sans font-medium uppercase tracking-[0.1em]">
            <li><Link to="/courses" className="flex items-center gap-3 hover:text-[var(--brand)] transition-colors"><BookOpen className="h-4 w-4" /> Advanced Academy</Link></li>
            <li><Link to="/blog" className="flex items-center gap-3 hover:text-[var(--brand)] transition-colors"><Activity className="h-4 w-4" /> Market Insights</Link></li>
            <li><Link to="/about" className="flex items-center gap-3 hover:text-[var(--brand)] transition-colors"><Shield className="h-4 w-4" /> About IFX</Link></li>
            <li><Link to="/hiring" className="flex items-center gap-3 hover:text-[var(--brand)] transition-colors"><Users className="h-4 w-4" /> Join Our Team</Link></li>
          </ul>
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
