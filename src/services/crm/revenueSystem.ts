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

    // Fetch global affiliate settings from feature_flags
    let defaultRate = 10.00;
    let threshold = 4;
    let escalatedRate = 20.00;

    try {
      const { data: flag } = await publicSupabase
        .from('feature_flags')
        .select('value, enabled')
        .eq('key', 'affiliate_settings')
        .maybeSingle();

      if (flag && flag.enabled && flag.value) {
        const val = flag.value as any;
        defaultRate = Number(val.default_rate) || 10.00;
        threshold = Number(val.threshold) || 4;
        escalatedRate = Number(val.escalated_rate) || 20.00;
      }
    } catch (err) {
      console.warn("Failed to fetch custom affiliate settings:", err);
    }

    let percentage = defaultRate;
    let referralCode = affiliate?.code || null;

    if (affiliate) {
      percentage = Number(affiliate.commission_rate) || defaultRate;
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
    // If they have made sales in the current month exceeding the threshold, scale rate dynamically!
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { count } = await publicSupabase
        .from('commissions')
        .select('id', { count: 'exact', head: true })
        .eq('agent_id', agentId)
        .gte('created_at', firstDayOfMonth);

      if (count && count >= threshold) {
        percentage = escalatedRate; // Dynamic scale to escalated bonus rate
        console.log(`[CRM Commission Engine]: Escalated agent ${agentId} rate to ${escalatedRate}% due to active performance (${count} sales).`);
        
        // Persist the escalated rate to their affiliate_codes profile
        if (referralCode) {
          await publicSupabase
            .from('affiliate_codes')
            .update({ commission_rate: escalatedRate })
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
