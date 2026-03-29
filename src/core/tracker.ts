import { supabase } from "../lib/supabase";
import { leadPipeline } from "../services/crm/leadPipeline";

/**
 * Institutional Behavioral Tracking Engine (v1.24)
 * Refined for Phase 4 CRM intelligence.
 * Silent, async, and non-blocking intent capture.
 */

export type EventPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TrackingEvent {
  event_type: string;
  priority?: EventPriority;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'ifx_anon_id';

class Tracker {
  private anonId: string;

  constructor() {
    this.anonId = this.initializeAnonId();
  }

  private initializeAnonId(): string {
    if (typeof window === 'undefined') return 'server';
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = `anon_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  /**
   * Captures a behavioral event silently.
   * Decisions: UI Emits -> tracker.ts captures -> CRM Pipeline processes.
   */
  async track(eventType: string, metadata: any = {}) {
    // 1. Audit status
    const priority = this.inferPriority(eventType);
    const timestamp = new Date().toISOString();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const payload = {
        user_id: userId,
        anon_id: this.anonId,
        event_type: eventType,
        priority,
        metadata: {
          ...metadata,
          path: typeof window !== 'undefined' ? window.location.pathname : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          timestamp
        },
        event_at: timestamp
      };

      // 2. Async Persistence (Standardized table: user_events)
      supabase
        .from('user_events')
        .insert([payload])
        .then(({ error }) => {
           if (error) console.warn(`[CRM] Behavioral Error (${eventType}):`, error.message);
        });

      // 3. Automated CRM Lifecycle Logic (Non-blocking)
      leadPipeline.processEvent(userId, this.anonId, eventType).then();

    } catch (err) {
      console.error("[CRM] Tracking Life-cycle Exception:", err);
    }
  }

  private inferPriority(type: string): EventPriority {
    const HIGH = ['purchase_attempt', 'algo_click', 'form_submit', 'signup'];
    const MEDIUM = ['pricing_click', 'signal_view', 'webinar_register', 'login'];
    const CRITICAL = ['payment_uploaded'];
    
    if (CRITICAL.includes(type)) return 'CRITICAL';
    if (HIGH.includes(type)) return 'HIGH';
    if (MEDIUM.includes(type)) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Cross-visit identification logic.
   * Merges anon legacy data with authenticated account.
   */
  async identify(userId: string) {
    if (!userId) return;
    
    // Retroactive intelligence: link anon journey to this user
    supabase
      .from('user_events')
      .update({ user_id: userId })
      .eq('anon_id', this.anonId)
      .is('user_id', null)
      .then();

    // Link in lead table
    supabase
      .from('leads')
      .update({ user_id: userId })
      .eq('anon_id', this.anonId)
      .is('user_id', null)
      .then();
  }
}

export const tracker = new Tracker(); 
