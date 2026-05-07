export interface Entitlement {
  feature: string;
  active: boolean;
  expires_at: string | null;
}

export const getAccess = (userProfile: any, entitlements: Entitlement[] = []) => {
  const access: Record<string, any> = {
    signals: false,
    algo: false,
    academy: false,
    webinars: false,
    admin: false,
    revenue: false,
    crm: false,
    fulfillment: false,
    logs: false
  };

  if (!userProfile) return access;

  const role = userProfile.role || "trader";

  // Role Intelligence Matrix: Baseline Capability Discovery
  switch (role) {
    case "admin":
    case "superadmin":
      return { 
        signals: true, algo: true, academy: true, webinars: true, 
        admin: true, revenue: true, crm: true, fulfillment: true, logs: true 
      };
    
    case "sales_agent":
      return { 
        ...access, admin: true, signals: true, crm: true, webinars: true 
      };
    
    case "support":
      return { 
        ...access, admin: true, academy: true, crm: true, fulfillment: true 
      };
    
    case "analyst":
      return { 
        ...access, admin: true, signals: true, revenue: true, logs: true 
      };
  }

  const now = new Date();
  // ... (remainder same)

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
