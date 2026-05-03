import { safeQuery } from "../utils/supabase";

export const AdminService = {
  getStats: async (supabaseClient: any) => {
    const [users, activeSubs, sales] = await Promise.all([
      safeQuery<any>(() => supabaseClient.from('users').select('*', { count: 'exact', head: true }), "AdminService.getStats:users"),
      safeQuery<any>(() => supabaseClient.from('bot_licenses').select('*', { count: 'exact', head: true }).eq('is_active', true), "AdminService.getStats:subs"),
      safeQuery<any[]>(() => supabaseClient.from('sales_tracking').select('sale_amount'), "AdminService.getStats:sales")
    ]);

    const totalRev = sales?.reduce((acc: number, curr: any) => acc + (curr.sale_amount || 0), 0) || 0;
    
    return {
      total_users: users || 0,
      active_subscriptions: activeSubs || 0,
      revenue_mtd: totalRev
    };
  },

  getAgents: async (supabaseClient: any) => {
    return safeQuery<any[]>(
      () => supabaseClient.from('agent_accounts').select('*, users(email, full_name)'),
      "AdminService.getAgents"
    );
  },

  createLicense: async (supabaseClient: any, data: { user_id: string; algo_id: string; duration_days?: number }) => {
    const { user_id, algo_id, duration_days } = data;
    const key = `IFX-${Math.random().toString(36).toUpperCase().substr(2, 4)}-${Math.random().toString(36).toUpperCase().substr(2, 4)}`;
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + (duration_days || 30));

    return safeQuery(
      () => supabaseClient
        .from('bot_licenses')
        .insert({
          user_id,
          algo_id,
          license_key: key,
          expires_at: expires_at.toISOString(),
          is_active: true
        })
        .select()
        .single(),
      "AdminService.createLicense"
    );
  },

  createContent: async (supabaseClient: any, data: { title: string; content_type: string; body: string; author_id: string; metadata?: any }) => {
    const { title, content_type, body, author_id, metadata } = data;
    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substr(2, 5);
    
    return safeQuery(
      () => supabaseClient
        .from('content_posts')
        .insert({
          title,
          slug,
          content_type,
          status: 'published',
          body,
          data: metadata || {},
          published_at: new Date().toISOString(),
          author_id
        }),
      "AdminService.createContent"
    );
  }
};
