// ═══════════════════════════════════════════════════
//   DESIGN TOKEN SYSTEM — IFXTrades
//   Single source of truth for all mathematical scales,
//   colors, spacing, and typography. No magic numbers.
// ═══════════════════════════════════════════════════

export const tokens = {
  colors: {
    // Brand scale
    emerald: 'var(--color8)',       
    cyan: 'var(--color39)',         
    purple: 'var(--color41)',
    
    // Background systems
    base: 'var(--color10)',         
    surface: 'var(--surface)',      
    raised: 'var(--raised)',        
    
    // Typography
    textPrimary: 'var(--color34)',
    textSecondary: 'var(--color35)',
    textMuted: 'var(--color36)',
    
    // Architecture & Borders
    borderDefault: 'rgba(255, 255, 255, 0.04)',
    borderEmphasis: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.12)',
    borderBrand: 'rgba(16, 185, 129, 0.2)',
    
    // Glassmorphism System
    glassBg: 'rgba(255, 255, 255, 0.015)',
    glassBorder: 'rgba(255, 255, 255, 0.04)',
  },
  
  spacing: {
    navHeight: '5rem',
    navHeightMobile: '4rem',
    section: '10rem',         // Macro layout mapping
    sectionSm: '6rem',
    content: '5rem',          // Meso layout mapping
    contentSm: '3rem',
  },
  
  radius: {
    card: '2.75rem',
    panel: '2.25rem',
    button: '1.25rem',
    pill: '999px',
    input: '1rem',
  },
  
  shadows: {
    card: '0 30px 80px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
    panel: '0 18px 44px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    glow: '0 16px 40px rgba(88, 242, 182, 0.18)', // Elite tracking
    float: '0 24px 60px rgba(0, 0, 0, 0.35)',
  },
  
  effects: {
    glassBlur: '32px',
    noiseOpacity: 0.02,
  },
  
  gradients: {
    elite: 'linear-gradient(135deg, var(--color34) 0%, var(--color35) 100%)',
    emerald: 'linear-gradient(135deg, var(--color8) 0%, var(--color42) 100%)',
    dark: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
  }
} as const;

export type DesignTokens = typeof tokens;
