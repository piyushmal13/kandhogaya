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
    // 1. Audit status
    const { data: agent } = await publicSupabase
      .from('agent_accounts')
      .select('commission_rate, account_status')
      .eq('user_id', agentId)
      .maybeSingle();

    if (!agent || agent.account_status !== 'active') return;

    // 2. Decision logic: calculate commission based on agent rate
    const percentage = Number(agent.commission_rate) || 15; // default 15%
    
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
    await publicSupabase.rpc('increment_agent_conversion', { agent_id: agentId });
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
