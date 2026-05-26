import { publicSupabase, safeQuery } from "../../lib/supabase";

/**
 * Institutional Revenue Engine (v1.24)
 * Closes the loop from conversion to payout.
 * Admissions are strictly audited.
 */

export const revenueSystem = {
  /**
   * Commission Engine: Calculates and stores immutable revenue record.
   * Logic: When conversion verified, track the agent's cut.
   */
  trackCommission: async (leadId: string, agentId: string, product: { type: string, amount: number, id?: string }) => {
    // 1. Retrieve affiliate code & custom commission rate
    const { data: affiliate } = await publicSupabase
      .from('affiliate_codes')
      .select('code, commission_rate')
      .eq('user_id', agentId)
      .maybeSingle();

    let percentage = 10.00; // default 10%
    let referralCode = affiliate?.code || null;

    if (affiliate) {
      percentage = Number(affiliate.commission_rate) || 10.00;
    } else {
      // Fallback: Check if they are in agent_accounts
      const { data: agent } = await publicSupabase
        .from('agent_accounts')
        .select('commission_rate, account_status')
        .eq('user_id', agentId)
        .maybeSingle();
      
      if (agent) {
        percentage = Number(agent.commission_rate) || 15.00;
      }
    }

    // 2. Automated threshold scaling rule:
    // If they have made >4 sales in the current month, scale their rate to 20% dynamically!
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { count } = await publicSupabase
        .from('commissions')
        .select('id', { count: 'exact', head: true })
        .eq('agent_id', agentId)
        .gte('created_at', firstDayOfMonth);

      if (count && count >= 4) {
        percentage = 20.00; // Dynamic scale to 20%
        console.log(`[CRM Commission Engine]: Escalated agent ${agentId} rate to 20% due to active performance.`);
        
        // Persist the escalated rate to their affiliate_codes profile
        if (referralCode) {
          await publicSupabase
            .from('affiliate_codes')
            .update({ commission_rate: 20.00 })
            .eq('user_id', agentId);
        }
      }
    } catch (err: any) {
      console.warn("[CRM] Failed to compute dynamic commission escalation:", err.message);
    }

    const commissionAmount = (product.amount * percentage) / 100;

    // 3. Immutable persist
    const commission = {
      lead_id: leadId,
      agent_id: agentId,
      amount: commissionAmount,
      percentage,
      source: product.type.toUpperCase(),
      product_id: product.id,
      status: 'PENDING'
    };

    await publicSupabase
      .from('commissions')
      .insert([commission]);
      
    // 4. Update agent performance metrics
    try {
      await publicSupabase.rpc('increment_agent_conversion', { agent_id: agentId });
    } catch {
      // RPC missing — silently skip
    }
  },

  /**
   * Aggregates Agent earnings for the board.
   */
  getAgentEarnings: async (agentId: string) => {
    const { data: commissions } = await publicSupabase
      .from('commissions')
      .select('amount, status, created_at')
      .eq('agent_id', agentId);

    if (!commissions) return { daily: 0, monthly: 0, total: 0 };

    const total = commissions.reduce((acc, c) => acc + Number(c.amount), 0);
    
    // Daily/Monthly logic
    const now = new Date();
    const isToday = (d: string) => new Date(d).toDateString() === now.toDateString();
    const isThisMonth = (d: string) => new Date(d).getMonth() === now.getMonth();
    
    const daily = commissions.filter(c => isToday(c.created_at)).reduce((acc, c) => acc + Number(c.amount), 0);
    const monthly = commissions.filter(c => isThisMonth(c.created_at)).reduce((acc, c) => acc + Number(c.amount), 0);

    return { daily, monthly, total };
  }
};
