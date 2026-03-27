export type SubscriptionPlan = 'basic' | 'pro' | 'elite';

export const getPlanAccess = (plan: SubscriptionPlan | string): string[] => {
  const mapping: Record<string, string[]> = {
    basic: ['signals'],
    pro: ['signals', 'academy'],
    elite: ['signals', 'academy', 'algo', 'webinars']
  };

  return mapping[plan] || [];
};

/**
 * Institutional Entitlement Generation: Plan -> Feature Capability Mapping
 */
export const generateEntitlements = (userId: string, plan: SubscriptionPlan | string, expiresAt: string | null) => {
  const features = getPlanAccess(plan);

  return features.map(f => ({
    user_id: userId,
    feature: f,
    active: true,
    expires_at: expiresAt
  }));
};
