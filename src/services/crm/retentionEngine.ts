import { publicSupabase, safeQuery } from "../../lib/supabase";

/**
 * Institutional Retention Engine (v1.24)
 * Detects inactivity and generates conversion hooks.
 * Admissions are strictly audited.
 */

export const retentionEngine = {
  /**
   * Scans for inactive leads and triggers re-engagement anchors.
   */
  detectInactivity: async () => {
    const threshold = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    
    // 1. Discover inactive prospects who haven't been re-engaged yet
    const leads = await safeQuery<any[]>(
      publicSupabase
        .from('leads')
        .select('id, user_id, anon_id, last_action_at')
        .lt('last_action_at', threshold)
        .is('reengagement_triggered_at', null)
        .limit(20)
    );

    if (!leads || leads.length === 0) return;

    // 2. Build personalized discovery hooks
    for (const lead of leads) {
      await retentionEngine.generateHook(lead);
    }
  },

  /**
   * Generates a behavioral hook: "X setups moved while you were away"
   */
  generateHook: async (lead: any) => {
    // Audit signal movement in the inactivity window
    const { count: signalCount } = await publicSupabase
      .from('signals')
      .select('*', { count: 'exact', head: true })
      .gt('created_at', lead.last_action_at);

    if (signalCount && signalCount > 0) {
      await publicSupabase
        .from('leads')
        .update({ 
          reengagement_triggered_at: new Date().toISOString(),
          priority_tag: `MISSED_${signalCount}_SIGNALS`
        })
        .eq('id', lead.id);
    }
  }
};
