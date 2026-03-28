import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Institutional Behavioral Intelligence Engine
 * Standardized signal capture with session persistence and source attribution.
 */

// Persistence Layer for Session Persistence
const SESSION_KEY = "ifx_behavioral_session";
const SOURCE_KEY = "ifx_discovery_source";
const AGENT_KEY = "ifx_agent_referral";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const getSource = () => {
  const urlParams = new URLSearchParams(globalThis.location.search);
  const utmSource = urlParams.get("utm_source");
  const agentRef = urlParams.get("ref");
  
  if (utmSource) {
    localStorage.setItem(SOURCE_KEY, utmSource);
  }
  if (agentRef) {
    localStorage.setItem(AGENT_KEY, agentRef);
  }
  
  return {
    source: utmSource || localStorage.getItem(SOURCE_KEY) || "direct",
    agent: agentRef || localStorage.getItem(AGENT_KEY) || null
  };
};

const getDevice = () => {
  const ua = globalThis.navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
  return "desktop";
};

// Deduplication Cache (In-Memory)
const eventCache = new Set<string>();

export const tracker = {
  /**
   * Capture a behavioral signal.
   * Includes session, source, and device fingerprinting.
   */
  async track(event: string, metadata: any = {}) {
    const sessionId = getSessionId();
    const { source, agent } = getSource();
    const device = getDevice();
    const timestamp = new Date().toISOString();

    // Deduplication Logic (Debounce same event within 500ms)
    const eventSlug = `${event}-${JSON.stringify(metadata)}`;
    if (eventCache.has(eventSlug)) return;
    eventCache.add(eventSlug);
    setTimeout(() => eventCache.delete(eventSlug), 500);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const payload = {
        event: event,
        user_id: userId,
        metadata: {
          ...metadata,
          session_id: sessionId,
          source,
          agent_code: agent,
          device,
          path: globalThis.location.pathname,
          userAgent: globalThis.navigator.userAgent,
          language: globalThis.navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: globalThis.document.referrer,
          screenResolution: `${globalThis.screen.width}x${globalThis.screen.height}`
        },
        timestamp
      };

      console.log(`[BehavioralEngine] Captured Signal: ${event}`, payload);

      // Async persistence in standardized analytics_events
      supabase.from("analytics_events").insert(payload).then(({ error }) => {
        if (error) console.error(`[BehavioralEngine] Signal Sync Error (${event}):`, error);
      });

      // Automated Activity Sync for Retention Engine
      if (userId) {
        this.syncActivity(userId);
      }

      // Automated Sales Funnel Progression
      if (userId && ["pricing_click", "purchase_attempt", "payment_uploaded", "webinar_register", "algo_click"].includes(event)) {
        this.advancePipeline(userId, event);
      }
    } catch (err) {
      console.error("[BehavioralEngine] Global Lifecycle Exception:", err);
    }
  },

  async syncActivity(userId: string) {
    const now = new Date();
    
    // 1. Fetch current status to determine delta
    const { data: pipeline } = await supabase
      .from("sales_pipeline")
      .select("last_active_at")
      .eq("user_id", userId)
      .single();

    let status = "active";
    if (pipeline?.last_active_at) {
      const lastActive = new Date(pipeline.last_active_at);
      const diffDays = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays > 7) status = "churned";
      else if (diffDays > 2) status = "at_risk";
    }

    const { error } = await supabase
      .from("sales_pipeline")
      .upsert({ 
        user_id: userId, 
        last_active_at: now.toISOString(),
        retention_status: status,
        updated_at: now.toISOString()
      }, { onConflict: "user_id" });
    
    if (error) console.error("[BehavioralEngine] Activity Sync Error:", error);
  },

  async advancePipeline(userId: string, event: string) {
    let stage = "new";
    if (["pricing_click", "algo_click"].includes(event)) stage = "interested";
    if (event === "webinar_register") stage = "interested";
    if (event === "purchase_attempt") stage = "payment_pending";
    if (event === "payment_uploaded") stage = "converted";

    const { source, agent } = getSource();

    const { error } = await supabase
      .from("sales_pipeline")
      .upsert({ 
        user_id: userId, 
        stage, 
        last_event: event,
        attribution_source: source,
        agent_code: agent,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

    if (error) console.error("[BehavioralEngine] Pipeline Sync Error:", error);
  }
};
