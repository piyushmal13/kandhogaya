/**
 * Institutional Spacing System (v7.0 Sovereign)
 * The canonical spacing reference for every layout surface.
 * Apply these constants to achieve visual rhythm across all pages.
 */
export const institutionalSpacing = {
  /** All page-level section vertical padding */
  section: 'py-16 lg:py-24',
  /** Horizontal container padding */
  container: 'px-6 lg:px-12',
  /** Card internal padding */
  card: 'p-6 lg:p-8',
  /** Grid column gaps */
  grid: 'gap-6 lg:gap-8',
  /** Hero section — larger top clearance for Navbar */
  hero: 'pt-24 lg:pt-32 pb-16 lg:pb-24',
  /** Inner section heading group spacing */
  sectionHeader: 'mb-12 lg:mb-16',
  /** Tight padding for compact UI elements */
  compact: 'p-4 lg:p-6',
  /** Max width container class */
  maxWidth: 'max-w-7xl mx-auto',
} as const;

export type SpacingKey = keyof typeof institutionalSpacing;
