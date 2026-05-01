import { publicSupabase, safeQuery } from "../../lib/supabase";

import { automationEngine } from "./automationEngine";

/**
 * Institutional Lead Decision Engine (v1.24)
 * Refined behavioral scoring + transition logic.
 * Admissions are strictly audited.
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
   */
  processEvent: async (userId: string | null, anonId: string | null, eventType: string) => {
    // 1. Audit delta
    const scoreDelta = SCORING_MAP[eventType] || 0;
    if (scoreDelta === 0) return;

    // 2. Discover lead
    const query = publicSupabase
      .from('leads')
      .select('id, user_id, anon_id, score, stage, is_hot');
    
    if (userId) query.eq('user_id', userId);
    else if (anonId) query.eq('anon_id', anonId);
    else return;

    const [lead] = await safeQuery<any[]>(query.limit(1));

    if (!lead) {
      // Create and score new lead
      const newLead = {
        user_id: userId,
        anon_id: anonId,
        score: scoreDelta,
        stage: leadPipeline.inferStage(scoreDelta, eventType),
        last_action_at: new Date().toISOString(),
        is_hot: scoreDelta >= HOT_LEAD_THRESHOLD
      };
      
      await publicSupabase.from('leads').insert([newLead]);
      return;
    }

    // 3. Update existing lead intelligence
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

    // 4. Trigger Instant Automation Reaction (Phase 5)
    automationEngine.reactToLeadUpdate(lead.id, updatedLead).then();
  },

  /**
   * Stage Inference Logic
   */
  inferStage: (score: number, lastEvent: string, currentStage: string = 'NEW'): LeadStage => {
    // Priority 1: Direct behavioral triggers
     if (lastEvent === 'payment_uploaded' || lastEvent === 'purchase_attempt') return 'PAYMENT_PENDING';
     if (lastEvent === 'converted_success') return 'CONVERTED';

     // Priority 2: Milestone scoring thresholds
     if (score >= 40) return 'HIGH_INTENT';
     if (score >= 15) return 'INTERESTED';
     
     return currentStage as LeadStage;
  }
};
