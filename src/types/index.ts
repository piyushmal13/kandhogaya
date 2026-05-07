/**
 * Global Type Definitions
 * Exactly mirrors the Supabase public schema — do not add fields not in the DB.
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

export interface QA {
  question: string;
  answer: string;
}

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  referred_by?: string;
  created_at: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'agent' | 'sales_agent' | 'support' | 'analyst';
}

// ---------------------------------------------------------------------------
// webinars
// ---------------------------------------------------------------------------
export interface WebinarSponsor {
  id: string;
  webinar_id: string;
  name: string;
  tier: 'Headline' | 'Partner' | 'Supporter' | 'Co-Sponsor';
  logo_url: string;
  website_url?: string;
}

export interface Webinar {
  id: string;
  title: string;
  description?: string;
  date_time: string;
  speaker_name?: string;
  status: 'upcoming' | 'live' | 'past';
  is_paid: boolean;
  price: number;
  created_at: string;
  speaker_profile_url?: string;
  brand_logo_url?: string;
  webinar_image_url?: string;
  sponsor_logos: string[]; // jsonb
  speaker_images: string[]; // jsonb
  about_content?: string;
  q_and_a: QA[];           // jsonb
  advanced_features: Record<string, any>; // jsonb
  max_attendees: number;
  registration_count: number;
  type: string;
  recording_url?: string;
  streaming_url?: string;
  
  // UI Virtual / Joined
  sponsors?: WebinarSponsor[];
  metadata?: {
    partner_name?: string;
    learning_points?: string[];
    author_bio?: string;
  };
}

// ---------------------------------------------------------------------------
// Intelligence  (flat table — NOT a content_post)
// ---------------------------------------------------------------------------
export interface Intelligence {
  id: string;
  type?: 'TRADE' | 'ANALYSIS' | 'NEWS';
  symbol: string;
  asset?: string;             // legacy DB field
  direction?: 'BUY' | 'SELL';
  entry?: number;
  entry_price?: number;       // legacy DB field
  stop_loss?: number;
  take_profit?: number;
  status: 'active' | 'closed' | 'cancelled' | 'pending';
  created_at: string;
  metadata?: Record<string, any>;
  result?: 'WIN' | 'LOSS' | 'BREAKEVEN' | null;
  pips?: number;
}

// ---------------------------------------------------------------------------
// products
// ---------------------------------------------------------------------------
export interface LongPlanOffer {
  duration: string;   // e.g. "1 Year"
  price: number;
  discount: string;   // e.g. "20% Off"
}

export interface PerformanceResult {
  id: string;
  algo_id: string;
  roi_pct: number;
  drawdown_pct: number;
  period_start: string;
  period_end: string;
  created_at: string;
  // UI Legacy compatibility
  win_rate?: number;
  monthly_return?: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  image_url?: string;
  created_at: string;
  risk_classification?: string;
  monthly_roi_pct?: number;
  min_capital?: number;
  is_active?: boolean;
  compliance_disclaimer?: string;
  
  // Legacy / UI Helpers
  category?: string;
  performance?: PerformanceResult;
  long_plan_offers?: LongPlanOffer[];
  performance_data?: { type: 'text' | 'image'; content: string }[];
}

// ---------------------------------------------------------------------------
// product_variants
// ---------------------------------------------------------------------------
export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  stripe_price_id?: string;
  razorpay_plan_id?: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// reviews  (column is "text", NOT "comment")
// ---------------------------------------------------------------------------
export interface Review {
  id?: string;
  user_id?: string;    // References auth.users(id)
  name: string;        // Fallback for anonymous or custom name
  user_name?: string;  // Internal identifier
  rating: number;
  text: string;
  role?: string;
  image_url?: string;
  region?: string;     // e.g. IN, US, EU
  source?: string;     // e.g. web, referral, campaign
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  priority?: number;   // show best first
  rejection_reason?: string;
  flagged?: boolean;    // for spam/fraud detection
  ip_address?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// content_posts  (maps to Blog page)
// ---------------------------------------------------------------------------
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;    // main text content column
  body?: string;      // alternate rich-text body column
  image_url?: string;
  featured_image?: string;
  category?: string;
  status: string;
  created_at: string;
  content_type: string;
  author_id?: string;
  metadata?: {
    cover_image?: string;
    image?: string;
    video_url?: string;
    bold_headline?: string;
    key_insights?: string[];
    author_bio?: string;
    author_name?: string;
    author_profile_url?: string;
    subtitle?: string;
    sidebar_ad?: {
      title: string;
      description: string;
      logo_url: string;
      link_url: string;
      button_text?: string;
    };
    broker_ad?: {
      name: string;
      logo_url: string;
      referral_url: string;
      description?: string;
      tagline?: string;
    };
  };
  // joined via apiHandlers
  author?: {
    full_name?: string;
    avatar_url?: string;
  };
  // Legacy / Extended fields — kept for compatibility
  bold_headline?: string;
  author_name?: string;
  author_profile_url?: string;
  author_bio?: string;
  video_url?: string;
}

export type ContentPost = Blog;
export type Signal = Intelligence;

// ---------------------------------------------------------------------------
// courses / lessons
// ---------------------------------------------------------------------------
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  video_url?: string;
  content?: string;
  sort_order: number;
  created_at: string;
  // UI fields
  is_free?: boolean;
  duration?: string;
}

// Chapter is an alias for Lesson — used in CourseDetail.tsx
export type Chapter = Lesson;

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  image_url?: string;   // alias used in UI getCourseImage()
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  created_at: string;
  // UI display fields (add via ALTER TABLE to persist in Supabase)
  duration?: string;
  instructor_name?: string;
  // joined via lessons query — alias used in pages
  chapters?: Lesson[];
  lessons?: Lesson[];
}

// ---------------------------------------------------------------------------
// agent_accounts
// ---------------------------------------------------------------------------
export interface AgentAccount {
  id: string;
  user_id: string;
  account_status: string;   // 'pending' | 'active' | etc.
  commission_rate: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// sales_tracking
// ---------------------------------------------------------------------------
export interface SaleTracking {
  id: string;
  agent_id: string;
  user_id: string;
  product_id: string;
  sale_amount: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// algo_bots / bot_licenses
// ---------------------------------------------------------------------------
export interface AlgoBot {
  id: string;
  product_id?: string;
  name: string;
  version?: string;
  download_url?: string;
  checksum?: string;
  created_at: string;
}

export interface BotLicense {
  id: string;
  user_id?: string;
  algo_id?: string;
  license_key: string;
  account_id?: string;
  hardware_id?: string;
  is_active: boolean;
  last_validated_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  email: string;
  source?: string;
  created_at: string;
  stage: 'NEW' | 'INTERESTED' | 'HIGH_INTENT' | 'PAYMENT_PENDING' | 'CONVERTED';
  score?: number;
  is_hot?: boolean;
  last_action_at?: string;
  conversion_probability?: number;
  priority_tag?: string;
  referred_by_code?: string;
  assigned_to?: string; // agent_id
  crm_metadata?: Record<string, any>;
  metadata?: Record<string, any>; // legacy compatibility

  // UI Virtual Fields (Joined)
  name?: string; // Falls back to email in mapper
  status?: string; // Maps from 'stage' in mapper
  active_licenses?: number;
  webinar_count?: number;
  assigned_agent_code?: string;
  assigned_agent_name?: string;
}

export interface WebinarRegistration {
  id: string;
  webinar_id: string;
  user_id: string;
  created_at: string;
  // UI Virtual Fields
  email?: string;
  attended?: boolean;
  payment_status?: string;
}

export interface MarketPair {
  id: string;
  symbol: string;
  price: number;
  change: number | string;
  change_percent: number;
  volume: number;
  last_updated: string;
  high_24h: number;
  low_24h: number;
  up?: boolean;
}
