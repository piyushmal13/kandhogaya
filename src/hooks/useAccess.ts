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
  const { user, userProfile, loading: authLoading } = useAuth();

  const access = useMemo(() => {
    if (authLoading) return { plan: 'free' as PlanTier, isLoading: true };
    if (!user) return { plan: 'free' as PlanTier, isLoading: false };

    // 🚀 [IT TEAM] Access Determination Logic
    // Logic: Admin = Elite, otherwise check metadata/licenses
    // DB-Driven RBAC: Check userProfile role instead of hardcoded emails
    const isAdmin = userProfile?.role === 'admin';
    
    if (isAdmin) return { plan: 'elite' as PlanTier, isLoading: false };

    if (userProfile?.isPro) return { plan: 'pro' as PlanTier, isLoading: false };

    // Default to free
    return { plan: 'free' as PlanTier, isLoading: false };
  }, [user, userProfile, authLoading]);

  return {
    isLoggedIn: !!user,
    user: user || null,
    plan: access.plan,
    isPro: access.plan === 'pro' || access.plan === 'elite',
    isElite: access.plan === 'elite',
    isLoading: access.isLoading
  };
};
