/**
 * Institutional Upsell Engine (v1.24)
 * Behavior-based contextual revenue triggers.
 * Admissions are strictly audited.
 */

export interface UpsellOffer {
  id: string;
  title: string;
  message: string;
  cta: string;
  targetTier: 'pro' | 'elite';
}

export const upsellEngine = {
  /**
   * Discovers the next logical upgrade for the user based on institutional intent.
   */
  getLogicalUpsell: (currentTier: string, interaction: string): UpsellOffer | null => {
    // Decision 1: Guest to Pro
    if (currentTier === 'free') {
       if (interaction === 'signal_view') {
          return {
             id: 'signals_pro',
             title: 'Institutional Edge',
             message: 'Unlock full SL/TP parameters for institutional signals.',
             cta: 'Get Pro Access',
             targetTier: 'pro'
          };
       }
       if (interaction === 'webinar_register') {
          return {
             id: 'webinar_pro',
             title: 'Elite Education',
             message: 'Access premium masterclasses and recording archives.',
             cta: 'Upgrade to Workshops',
             targetTier: 'pro'
          };
       }
    }

    // Decision 2: Pro to Elite
    if (currentTier === 'pro') {
       if (interaction === 'algo_click') {
          return {
             id: 'algo_elite',
             title: 'Quantitative Workflow',
             message: 'Deploy 24/7 autonomous institutional algorithmic execution.',
             cta: 'Deploy Elite Bots',
             targetTier: 'elite'
          };
       }
    }

    return null;
  }
};
