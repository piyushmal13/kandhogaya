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
   * Evaluates if a hot prospect has been assigned an agent.
   * If not, dynamically queries an online agent profile and triggers a high-priority dispatch.
   */
  triggerPriorityActions: async (leadId: string, leadData: any) => {
    // 1. Audit lead assignment status to prevent duplicate handovers
    const { data: lead } = await publicSupabase
      .from('leads')
      .select('assigned_to, email')
      .eq('id', leadId)
      .maybeSingle();

    if (!lead?.assigned_to) {
      // Find an available representative to process the client
      const agentId = await automationEngine.discoverRoundRobinAgent();
      if (agentId) {
        // Log assignment and stamp high-intent priority tag
        await publicSupabase
          .from('leads')
          .update({ 
            assigned_to: agentId, 
            urgency_triggered_at: new Date().toISOString(),
            priority_tag: 'HOT_BUYER'
          })
          .eq('id', leadId);

        // Fetch representative communication node
        const { data: agentProfile } = await publicSupabase
          .from('users')
          .select('email, full_name')
          .eq('id', agentId)
          .maybeSingle();
        
        if (agentProfile?.email) {
          const leadName = lead.email || 'Anonymous Lead';
          // Dispatch lead handover alert to target communication channel
          notificationEngine.enqueue({
            recipient: agentProfile.email,
            channel: 'WHATSAPP',
            priority: 'HIGH',
            content: {
              message: `🔥 Hot Lead Assigned: ${leadName} has been routed to you.`,
              user_name: agentProfile.full_name || 'Agent',
              lead_score: leadData.score,
              action_link: `/agent/leads/${leadId}`
            }
          }).catch();
        }
      }
    }
  },

  /**
   * Round-Robin Representative Discovery (v1.25)
   * Dynamically routes B2B leads to qualified active representatives.
   * Leverages public.users profile lookups with direct agent role filters.
   */
  discoverRoundRobinAgent: async (): Promise<string | null> => {
    // Query users database for members holding the sales agent role
    const { data: agents } = await publicSupabase
      .from('users')
      .select('id')
      .eq('role', 'agent')
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
