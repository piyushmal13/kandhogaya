import { publicSupabase, safeQuery } from "../../lib/supabase";

import { automationEngine } from "./automationEngine";

/**
 * Institutional Lead Decision Engine (v1.24 — Schema-Aligned)
 * Adapted to actual `leads` table schema:
 *   id, email, source, stage, score, is_hot, last_action_at,
 *   crm_metadata, assigned_to, urgency_triggered_at,
 *   reengagement_triggered_at, conversion_probability,
 *   priority_tag, referred_by_code
 *
 * NOTE: user_id and anon_id do NOT exist in the live schema.
 * Behavioral tracking uses session-level metadata stored in crm_metadata.
 */

const SCORING_MAP: Record<string, number> = {
  page_view: 1,
  signal_view: 3,
  pricing_click: 10,
  algo_click: 15,
  webinar_register: 20,
  purchase_attempt: 40,
  payment_uploaded: 80,
  login: 5,
  signup: 10
};

const HOT_LEAD_THRESHOLD = 50;

export type LeadStage = 'NEW' | 'INTERESTED' | 'HIGH_INTENT' | 'PAYMENT_PENDING' | 'CONVERTED';

export const leadPipeline = {
  /**
   * Decision Engine: Processes events and updates intelligence.
   * Identifies lead by email from supabase session, or skips if anonymous.
   */
  processEvent: async (userId: string | null, _anonId: string | null, eventType: string) => {
    const scoreDelta = SCORING_MAP[eventType] || 0;
    if (scoreDelta === 0) return;

    // Only process events for authenticated users who have an email we can look up
    if (!userId) return;

    // Resolve user email from auth
    let userEmail: string | null = null;
    try {
      const { data: { user } } = await publicSupabase.auth.getUser();
      userEmail = user?.email ?? null;
    } catch {
      return;
    }

    if (!userEmail) return;

    // Look up lead by email (the only stable identifier in the live schema)
    const query = publicSupabase
      .from('leads')
      .select('id, email, score, stage, is_hot')
      .eq('email', userEmail)
      .limit(1);

    const [lead] = await safeQuery<any[]>(query);

    if (!lead) {
      // Create new lead entry
      const newLead = {
        email: userEmail,
        source: 'organic',
        score: scoreDelta,
        stage: leadPipeline.inferStage(scoreDelta, eventType),
        last_action_at: new Date().toISOString(),
        is_hot: scoreDelta >= HOT_LEAD_THRESHOLD,
        crm_metadata: { first_event: eventType }
      };
      await publicSupabase.from('leads').insert([newLead]);
      return;
    }

    // Update existing lead
    const score = (lead.score || 0) + scoreDelta;
    const stage = leadPipeline.inferStage(score, eventType, lead.stage);

    const updatedLead = {
      score,
      stage,
      is_hot: score >= HOT_LEAD_THRESHOLD,
      last_action_at: new Date().toISOString()
    };

    await publicSupabase
      .from('leads')
      .update(updatedLead)
      .eq('id', lead.id);

    // Trigger automation reaction
    automationEngine.reactToLeadUpdate(lead.id, updatedLead).then();
  },

  /**
   * Stage Inference Logic
   */
  inferStage: (score: number, lastEvent: string, currentStage: string = 'NEW'): LeadStage => {
    if (lastEvent === 'payment_uploaded' || lastEvent === 'purchase_attempt') return 'PAYMENT_PENDING';
    if (lastEvent === 'converted_success') return 'CONVERTED';
    if (score >= 40) return 'HIGH_INTENT';
    if (score >= 15) return 'INTERESTED';
    return currentStage as LeadStage;
  }
};
