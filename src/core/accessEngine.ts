export interface Entitlement {
  feature: string;
  active: boolean;
  expires_at: string | null;
}

export const getAccess = (userProfile: any, entitlements: Entitlement[] = []) => {
  const access: Record<string, boolean> = {
    signals: false,
    algo: false,
    academy: false,
    webinars: false,
    admin: false
  };

  if (!userProfile) return access;

  // Institutional Admin Override: Global Signal
  if (userProfile.role === "admin") {
    return {
      signals: true,
      algo: true,
      academy: true,
      webinars: true,
      admin: true
    };
  }

  const now = new Date();

  // Entitlement Discovery: Resolve Active Capability Signals
  entitlements.forEach(e => {
    if (!e.active) return;

    // Temporal Signal Validation
    if (e.expires_at && new Date(e.expires_at) < now) return;

    // Map Entitlement to Platform Access Layer
    if (access[e.feature] !== undefined) {
      access[e.feature] = true;
    }
  });

  // Backward Compatibility: 'isPro' Fallback Signal
  if (userProfile.isPro) {
    access.signals = true;
    access.algo = true;
    access.academy = true;
    access.webinars = true;
  }

  return access;
};
