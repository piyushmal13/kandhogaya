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
  Video,
} from "lucide-react";

import { BRANDING } from "../../constants/branding";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/5 pt-24 pb-12">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(88,242,182,0.1),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]" />

    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_.8fr_.8fr_.9fr]">
        <div className="site-panel p-8">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 overflow-hidden group-hover:border-emerald-500/30 transition-all duration-500">
              <img src={BRANDING.logoUrl} alt="IFXTrades Logo" className="h-11 w-11 object-contain transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.22em] text-white">{BRANDING.name}</div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Institutional Trading Surface</div>
            </div>
          </Link>

          <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
            {BRANDING.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={BRANDING.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="site-panel-muted flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-slate-200"
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-200" />
                WhatsApp Desk
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
            </a>
            <a
              href={`mailto:${BRANDING.supportEmail}`}
              className="site-panel-muted flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-slate-200"
            >
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-200" />
                Support
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
            </a>
          </div>
        </div>

        <div className="site-panel-muted p-6">
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-white">Platform</h4>
          <ul className="space-y-4 text-sm text-slate-300">
            <li><Link to="/signals" className="hover:text-white">Live Signals</Link></li>
            <li><Link to="/marketplace" className="hover:text-white">Algorithm Marketplace</Link></li>
            <li><Link to="/results" className="hover:text-white">Performance Results</Link></li>
            <li><Link to="/login" className="hover:text-white">Client Access</Link></li>
          </ul>
        </div>

        <div className="site-panel-muted p-6">
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-white">Research</h4>
          <ul className="space-y-4 text-sm text-slate-300">
            <li><Link to="/courses" className="inline-flex items-center gap-2 hover:text-white"><BookOpen className="h-4 w-4 text-emerald-200" /> Academy</Link></li>
            <li><Link to="/blog" className="inline-flex items-center gap-2 hover:text-white"><Activity className="h-4 w-4 text-emerald-200" /> Market Insights</Link></li>
            <li><Link to="/webinars" className="inline-flex items-center gap-2 hover:text-white"><Video className="h-4 w-4 text-emerald-200" /> Webinars</Link></li>
            <li><Link to="/contact" className="inline-flex items-center gap-2 hover:text-white"><MessageSquare className="h-4 w-4 text-emerald-200" /> Contact Desk</Link></li>
          </ul>
        </div>

        <div className="site-panel p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300"></span>
            </div>
            <span className="text-xs font-semibold tracking-[0.28em] text-emerald-100/80">SYSTEM ONLINE</span>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Execution Layer</span>
              <span className="font-semibold text-white">12ms</span>
            </div>
            <div className="flex justify-between">
              <span>Research Uptime</span>
              <span className="font-semibold text-white">99.99%</span>
            </div>
            <div className="flex justify-between">
              <span>Region</span>
              <span className="inline-flex items-center gap-2 font-semibold text-white"><Globe className="h-4 w-4 text-emerald-200" /> Global</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-xs leading-6 text-slate-400">
              Designed for signals, education, and algorithm licensing with a single premium visual system.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-6 border-t border-white/5 pt-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 text-xs text-slate-500 md:flex-row md:items-center">
          <span>Copyright 2026 {BRANDING.name}. All rights reserved.</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-700 md:block" />
          <span>Institutional trading intelligence for modern retail execution.</span>
        </div>

        <div className="flex flex-wrap gap-5 text-xs font-medium text-slate-400">
          <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> Terms of Service
          </Link>
          <Link to="/risk" className="hover:text-white transition-colors flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Risk Disclosure
          </Link>
          <Link to="/cookies" className="hover:text-white transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>

      <div className="mt-10 border-t border-white/5 pt-8 text-[11px] leading-6 text-slate-600">
        Risk Warning: Trading leveraged products such as Forex and CFDs carries a high level of risk and may not be suitable for all investors. Consider your objectives, experience, and risk appetite before trading live capital. Seek independent advice where appropriate.
      </div>
    </div>
  </footer>
);
