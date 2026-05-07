import { publicSupabase } from "../../lib/supabase";
import { notificationEngine } from "./notificationEngine";

/**
 * Institutional Automation Engine (v1.24)
 * Reacts to lead state changes with revenue-driving actions.
 * Admissions are strictly audited.
 */

export const automationEngine = {
  /**
   * Automates the lead-to-agent handover and urgency triggering.
   */
  reactToLeadUpdate: async (leadId: string, leadData: { score: number, stage: string, is_hot: boolean }) => {
    // 1. Hot Lead Urgency Action
    if (leadData.is_hot) {
      await automationEngine.triggerPriorityActions(leadId, leadData);
    }
    
    // 2. Behavioral Probability Calculation
    const prob = automationEngine.calculateConversionProbability(leadData.score, leadData.stage);
    
    await publicSupabase
      .from('leads')
      .update({ conversion_probability: prob })
      .eq('id', leadId);
  },

  /**
   * High-Velocity Sales Assignment
   */
  triggerPriorityActions: async (leadId: string, leadData: any) => {
    // 1. Audit Assignment status
    const { data: lead } = await publicSupabase
      .from('leads')
      .select('assigned_to, email')
      .eq('id', leadId)
      .maybeSingle();

    if (!lead?.assigned_to) {
      const agentId = await automationEngine.discoverRoundRobinAgent();
      if (agentId) {
        await publicSupabase
          .from('leads')
          .update({ 
            assigned_to: agentId, 
            urgency_triggered_at: new Date().toISOString(),
            priority_tag: 'HOT_BUYER'
          })
          .eq('id', leadId);
          
        // Increment agent load
        await publicSupabase.rpc('increment_agent_load', { agent_id: agentId });

        // [PHASE 6] Enqueue External Notification
        const { data: agentProfile } = await publicSupabase.from('agents').select('*').eq('id', agentId).maybeSingle();
        
        if ((agentProfile as any)?.phone) {
          const leadName = lead.email || 'Anonymous Lead';
          notificationEngine.enqueue({
            recipient: (agentProfile as any).phone,
            channel: 'WHATSAPP',
            priority: 'HIGH',
            content: {
              message: `🔥 Hot Lead Assigned: ${leadName}`,
              user_name: leadName,
              lead_score: leadData.score,
              action_link: `/agent/leads/${leadId}`
            }
          }).catch();
        }
      }
    }
  },

  /**
   * Round-Robin Logic (v1.24)
   * Discovers the next agent based on current load and performance.
   */
  discoverRoundRobinAgent: async (): Promise<string | null> => {
    const { data: agents } = await publicSupabase
      .from('agents')
      .select('id')
      .eq('is_online', true)
      .order('current_load', { ascending: true })
      .order('performance_score', { ascending: false })
      .limit(1);

    return agents?.[0]?.id || null;
  },

  calculateConversionProbability: (score: number, stage: string): number => {
    let base = Math.min(score / 2, 40); // Max 40% from score
    if (stage === 'HIGH_INTENT') base += 20;
    if (stage === 'PAYMENT_PENDING') base += 35;
    if (stage === 'CONVERTED') base = 100;
    return Math.min(base, 99);
  }
};
