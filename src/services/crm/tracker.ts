import { publicSupabase } from "../../lib/supabase";

/**
 * Institutional Behavioral Tracking Engine (v1.24)
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
   * Logic: UI Emits -> tracker.ts captures -> Silently pushed to DB.
   */
  async track(event: TrackingEvent) {
    // Determine priority if not provided
    const priority = event.priority || this.inferPriority(event.event_type);

    const payload = {
      anon_id: this.anonId,
      event_type: event.event_type,
      priority,
      metadata: {
        ...event.metadata,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        timestamp: new Date().toISOString()
      }
    };

    // Silent background execution
    publicSupabase
      .from('user_events')
      .insert([payload])
      .then(({ error }) => {
         if (error) console.warn('[CRM] Event drop:', error.message);
      });
  }

  private inferPriority(type: string): EventPriority {
    const HIGH = ['purchase_attempt', 'algo_click', 'form_submit'];
    const MEDIUM = ['pricing_click', 'signal_view', 'webinar_register'];
    const CRITICAL = ['payment_uploaded'];
    
    if (CRITICAL.includes(type)) return 'CRITICAL';
    if (HIGH.includes(type)) return 'HIGH';
    if (MEDIUM.includes(type)) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Merges anon_id with authenticated user.
   */
  async identify(userId: string) {
    if (!userId) return;
    
    // Update existing anon events to this user (retroactive intelligence)
    publicSupabase
      .from('user_events')
      .update({ user_id: userId })
      .eq('anon_id', this.anonId)
      .is('user_id', null)
      .then();
  }
}

export const ibt = new Tracker(); // Institutional Behavioral Tracker
