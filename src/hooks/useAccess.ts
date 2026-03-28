import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';

/**
 * Institutional Entitlement Engine (Phase 3)
 * 
 * Derives account tier purely from the user's active license state.
 * This is the single source of truth for UI gating (never for data block).
 */

export type PlanTier = 'free' | 'pro' | 'elite';

export interface AccessState {
  isLoggedIn: boolean;
  user: any | null;
  plan: PlanTier;
  isPro: boolean;
  isElite: boolean;
  isLoading: boolean;
}

export const useAccess = (): AccessState => {
  const { user, loading: authLoading } = useAuth();

  const access = useMemo(() => {
    if (authLoading) return { plan: 'free' as PlanTier, isLoading: true };
    if (!user) return { plan: 'free' as PlanTier, isLoading: false };

    // 🚀 [IT TEAM] Access Determination Logic
    // Logic: Admin = Elite, otherwise check metadata/licenses
    const isAdmin = ['admin@ifxtrades.com', 'admin@tradinghub.com', 'piyushmal1301@gmail.com'].includes(user.email || '') || user.user_metadata?.role === 'admin';
    
    if (isAdmin) return { plan: 'elite' as PlanTier, isLoading: false };

    // Check for explicit 'elite' tags in user metadata (CRM forced flags)
    if (user.user_metadata?.plan === 'elite') return { plan: 'elite' as PlanTier, isLoading: false };
    if (user.user_metadata?.plan === 'pro') return { plan: 'pro' as PlanTier, isLoading: false };

    // Default to free
    return { plan: 'free' as PlanTier, isLoading: false };
  }, [user, authLoading]);

  return {
    isLoggedIn: !!user,
    user: user || null,
    plan: access.plan,
    isPro: access.plan === 'pro' || access.plan === 'elite',
    isElite: access.plan === 'elite',
    isLoading: access.isLoading
  };
};
