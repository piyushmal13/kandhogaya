import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { BotLicense } from '../types';

export interface UserDashboardData {
  licenses: BotLicense[];
  purchases: { id: string; product_name: string; purchased_at: string; status: string }[];
  webinarRegistrations: { id: string; title: string; date: string; status: string }[];
  totalSpent: number;
  memberSince: string | null;
}

/**
 * Unified User Dashboard Hook
 * Fetches all user-specific data in a single parallel batch.
 * Every dashboard widget can consume from this shared cache.
 */
function getCachedDashboardData(userId?: string): UserDashboardData | undefined {
  if (!userId) return undefined;
  const cached = localStorage.getItem(`dashboard_cache_v1_${userId}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function useDashboardData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard_data', user?.id],
    queryFn: async (): Promise<UserDashboardData> => {
      if (!user?.id) {
        return {
          licenses: [],
          purchases: [],
          webinarRegistrations: [],
          totalSpent: 0,
          memberSince: null,
        };
      }

      const cacheKey = `dashboard_cache_v1_${user.id}`;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Dashboard database fetch timed out')), 3500)
      );

      try {
        const [licensesRes, purchasesRes, webinarsRes, userRes] = await Promise.race([
          Promise.all([
            // Active bot licenses with real keys
            supabase
              .from('bot_licenses')
              .select('id, user_id, algo_id, license_key, is_active, expires_at, created_at')
              .eq('user_id', user.id)
              .eq('is_active', true)
              .order('created_at', { ascending: false }),

            // User's product purchases via user_entitlements
            supabase
              .from('user_entitlements')
              .select(`
                id, active, expires_at, created_at,
                product:product_id ( name, price )
              `)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false }),

            // Webinar registrations
            supabase
              .from('webinar_registrations')
              .select(`
                id, created_at, payment_status,
                webinars ( title, date_time )
              `)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(10),

            // User profile for member-since
            supabase
              .from('users')
              .select('created_at')
              .eq('id', user.id)
              .maybeSingle(),
          ]),
          timeoutPromise
        ]);

        const licenses = (licensesRes.data || []) as BotLicense[];

        const purchases = (purchasesRes.data || []).map((e: any) => ({
          id: e.id,
          product_name: e.product?.name || 'Algorithm License',
          purchased_at: e.created_at,
          status: e.active ? 'Active' : 'Expired',
        }));

        const webinarRegistrations = (webinarsRes.data || []).map((r: any) => ({
          id: r.id,
          title: r.webinars?.title || 'Session',
          date: r.webinars?.date_time || r.created_at,
          status: r.payment_status === 'completed' ? 'Confirmed' : 'Pending',
        }));

        const totalSpent = (purchasesRes.data || []).reduce(
          (sum: number, e: any) => sum + (e.product?.price || 0),
          0
        );

        const data: UserDashboardData = {
          licenses,
          purchases,
          webinarRegistrations,
          totalSpent,
          memberSince: userRes.data?.created_at || null,
        };

        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      } catch (error) {
        console.warn('Supabase fetch failed or timed out, falling back to local cache', error);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            return JSON.parse(cached);
          } catch (e) {
            console.error('Invalid cache format', e);
          }
        }
        // If all else fails
        return {
          licenses: [],
          purchases: [],
          webinarRegistrations: [],
          totalSpent: 0,
          memberSince: null,
        };
      }
    },
    initialData: () => getCachedDashboardData(user?.id),
    staleTime: 60_000,
    refetchInterval: 120_000,
    enabled: !!user?.id,
    retry: 2,
  });
}
