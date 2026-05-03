import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToggleLeft, ToggleRight, RefreshCw, Save, AlertCircle, CheckCircle2, Flag } from "lucide-react";
import { supabase } from "../../lib/supabase";

// ──────────────────────────────────────────────────────────────────────────────
// Flag Definitions — add new flags here. They are stored in platform_flags table.
// ──────────────────────────────────────────────────────────────────────────────
const FLAG_REGISTRY: { key: string; label: string; description: string; group: string; danger?: boolean }[] = [
  // ── Core Module Toggles (live in DB) ──
  {
    key:         "signals",
    label:       "Signals Module",
    description: "Enables the /signals page and live signal feed.",
    group:       "Modules",
  },
  {
    key:         "algo",
    label:       "Algo Marketplace",
    description: "Enables the /marketplace page for algo product listings.",
    group:       "Modules",
  },
  {
    key:         "academy",
    label:       "Academy Module",
    description: "Enables the /academy page and course catalog.",
    group:       "Modules",
  },
  {
    key:         "webinars",
    label:       "Webinars Module",
    description: "Enables the /webinars page and registration flow.",
    group:       "Modules",
  },
  {
    key:         "marketplace",
    label:       "Marketplace Module",
    description: "Enables the /marketplace route globally.",
    group:       "Modules",
  },
  {
    key:         "admin_panel",
    label:       "Admin Panel",
    description: "Enables access to the /admin route for authorized users.",
    group:       "System",
    danger:      true,
  },
  {
    key:         "sponsor_banners",
    label:       "Sponsor Banners",
    description: "Displays partner/sponsor logos in header and event pages.",
    group:       "Branding",
  },
  {
    key:         "affiliate_system",
    label:       "Affiliate System",
    description: "Activates agent referral tracking and /agent dashboard.",
    group:       "Growth",
  },
  {
    key:         "beta_signals",
    label:       "Beta Signals",
    description: "Exposes experimental signal algorithms to beta users.",
    group:       "Products",
  },
  // ── Management Flags ──
  {
    key:         "show_retail_brokers",
    label:       "Show Retail Broker Logos",
    description: "Displays Zerodha, Dhan, IBKR, Refinitiv in the PartnerLogos section.",
    group:       "Branding",
    danger:      true,
  },
  {
    key:         "webinar_registration_open",
    label:       "Webinar Registration Open",
    description: "Enables the Register button across all webinar pages.",
    group:       "Webinars",
  },
  {
    key:         "webinar_realtime_updates",
    label:       "Webinar Realtime Updates",
    description: "Enables realtime Postgres subscription on the webinars table.",
    group:       "Webinars",
  },
  {
    key:         "show_affiliate_hub",
    label:       "Affiliate Hub Visible",
    description: "Shows the /affiliate route in the navigation.",
    group:       "Growth",
  },
  {
    key:         "algo_marketplace_live",
    label:       "Algo Marketplace Live",
    description: "Makes the /marketplace page publicly accessible.",
    group:       "Products",
  },
  {
    key:         "urgency_banner_active",
    label:       "Urgency Banner",
    description: "Shows the countdown urgency banner at the top of all pages.",
    group:       "Marketing",
  },
  {
    key:         "institutional_reviews_live",
    label:       "Institutional Social Proof",
    description: "Enables the synchronized reviews/feedback section on the home page.",
    group:       "Branding",
  },
  {
    key:         "market_ticker_active",
    label:       "Live Market Ticker",
    description: "Enables the real-time ticker stream in the hero section.",
    group:       "Branding",
  },
  {
    key:         "maintenance_mode",
    label:       "Maintenance Mode",
    description: "Redirects all public routes to a maintenance page.",
    group:       "System",
    danger:      true,
  },
];

type FlagState = Record<string, boolean>;

const GROUP_ORDER = ["Modules", "Branding", "Webinars", "Growth", "Products", "Marketing", "System"];

// ──────────────────────────────────────────────────────────────────────────────

export const FeatureFlagManager = () => {
  const [flags,   setFlags]   = useState<FlagState>({});
  const [dirty,   setDirty]   = useState<Set<string>>(new Set());
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch from Supabase ────────────────────────────────────────────────────
  const fetchFlags = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("feature_flags")
        .select("key, enabled");

      if (error) throw error;

      const remote: FlagState = {};
      (data ?? []).forEach((row: { key: string; enabled: boolean }) => {
        remote[row.key] = row.enabled;
      });

      // Backfill any registry flag not yet in the DB with `false`
      FLAG_REGISTRY.forEach(f => {
        if (!(f.key in remote)) remote[f.key] = false;
      });

      setFlags(remote);
      setDirty(new Set());
    } catch (err: any) {
      showToast("error", `Failed to load flags: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFlags(); }, [fetchFlags]);

  // ── Toggle ─────────────────────────────────────────────────────────────────
  const toggle = (key: string) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
    setDirty(prev => { const n = new Set(prev); n.add(key); return n; });
  };

  // ── Save dirty flags to Supabase ───────────────────────────────────────────
  const saveAll = async () => {
    if (dirty.size === 0) return;
    setSaving(true);
    try {
      const upserts = [...dirty].map(key => ({ key, enabled: flags[key] }));
      const { error } = await supabase
        .from("feature_flags")
        .upsert(upserts, { onConflict: "key" });

      if (error) throw error;
      setDirty(new Set());
      showToast("success", `Saved ${upserts.length} flag(s) successfully.`);
    } catch (err: any) {
      showToast("error", `Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Group flags ────────────────────────────────────────────────────────────
  const grouped = GROUP_ORDER.map(group => ({
    group,
    items: FLAG_REGISTRY.filter(f => f.group === group),
  })).filter(g => g.items.length > 0);

  const getSaveLabel = () => {
    if (dirty.size === 0) return "Saved";
    return `Save ${dirty.size} Change${dirty.size === 1 ? "" : "s"}`;
  };
  const saveLabel = getSaveLabel();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">
            <Flag className="w-3.5 h-3.5" />
            Feature Flag Control
          </div>
          <p className="text-xs text-gray-600">
            Changes take effect immediately after Save — no redeploy required.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFlags}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={saveAll}
            disabled={saving || dirty.size === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black font-black text-xs rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saveLabel}
          </button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${
              toast.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {toast.type === "success"
              ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />
            }
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flag Groups */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      ) : (
        grouped.map(({ group, items }) => (
          <div key={group} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            {/* Group Header */}
            <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01]">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">{group}</span>
            </div>

            {/* Flags */}
            <div className="divide-y divide-white/5">
              {items.map(flag => {
                const isOn       = !!flags[flag.key];
                const isDirty    = dirty.has(flag.key);

                return (
                  <div
                    key={flag.key}
                    className={`flex items-center justify-between px-6 py-4 transition-all ${
                      isDirty ? "bg-emerald-500/[0.03]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{flag.label}</span>
                        {isDirty && (
                          <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest border border-amber-400/30 rounded px-1.5 py-0.5">
                            Unsaved
                          </span>
                        )}
                        {flag.danger && (
                          <span className="text-[8px] font-black text-red-400 uppercase tracking-widest border border-red-400/30 rounded px-1.5 py-0.5">
                            Caution
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{flag.description}</p>
                      <code className="text-[9px] text-gray-700 font-mono mt-1 block">{flag.key}</code>
                    </div>

                    <button
                      onClick={() => toggle(flag.key)}
                      aria-checked={isOn}
                      role="switch"
                      aria-label={`Toggle ${flag.label}`}
                      className={`flex items-center gap-1.5 transition-all ${
                        isOn ? "text-emerald-500" : "text-gray-600"
                      } hover:scale-110`}
                    >
                      {isOn
                        ? <ToggleRight className="w-8 h-8" />
                        : <ToggleLeft  className="w-8 h-8" />
                      }
                      <span className="text-[10px] font-black uppercase tracking-widest w-5">
                        {isOn ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Schema note */}
      <div className="flex items-start gap-2 text-[10px] text-gray-700 font-mono">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-700" />
        <span>
          Connected to <code className="text-gray-500">feature_flags (id uuid, key text UNIQUE, enabled boolean, created_at timestamptz)</code> in Supabase.
          Uses <code className="text-gray-500">upsert + on_conflict=key</code> — safe to run multiple times.
        </span>
      </div>
    </div>
  );
};
