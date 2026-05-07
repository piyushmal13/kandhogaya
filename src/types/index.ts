import type { Database } from './database.types';

// Re-export utility types
export type { Json } from './database.types';

// ---------------------------------------------------------------------------
// Database-derived Core Entities
// ---------------------------------------------------------------------------

export type User = Database['public']['Tables']['users']['Row'];

export type Product = Database['public']['Tables']['products']['Row'] & {
  slug?: string;
  performance?: Database['public']['Tables']['performance_results']['Row'] | null;
};

export type Webinar = Database['public']['Tables']['webinars']['Row'] & {
  sponsors?: Array<Database['public']['Tables']['webinar_sponsors']['Row']>;
  metadata?: {
    partner_name?: string;
    learning_points?: string[];
    author_bio?: string;
  };
};

export type WebinarSponsor = Database['public']['Tables']['webinar_sponsors']['Row'];

export type Intelligence = Database['public']['Tables']['signals']['Row'];
export type Signal = Intelligence; // alias

export type Blog = Database['public']['Tables']['content_posts']['Row'] & {
  // UI convenience aliases
  content?: string; // body column holds the main text
  author?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
};

export type Course = Database['public']['Tables']['courses']['Row'] & {
  chapters?: Database['public']['Tables']['lessons']['Row'][];
  lessons?: Database['public']['Tables']['lessons']['Row'][];
};

export type Lesson = Database['public']['Tables']['lessons']['Row'];

export type Review = Database['public']['Tables']['reviews']['Row'];

export type Lead = Database['public']['Tables']['leads']['Row'] & {
  name?: string;
  status?: string;
  active_licenses?: number;
  webinar_count?: number;
  assigned_agent_code?: string;
  assigned_agent_name?: string;
};

export type AgentAccount = Database['public']['Tables']['agent_accounts']['Row'];

export type SaleTracking = Database['public']['Tables']['sales_tracking']['Row'];

export type AlgoBot = Database['public']['Tables']['algo_bots']['Row'];

export type BotLicense = Database['public']['Tables']['bot_licenses']['Row'] & {
  algo?: AlgoBot;
  user?: User;
};

export type WebinarRegistration = Database['public']['Tables']['webinar_registrations']['Row'] & {
  email?: string;
  attended?: boolean;
  payment_status?: string;
};

export type MarketPair = Database['public']['Tables']['market_data']['Row'];

export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];

export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];

export type PerformanceResult = Database['public']['Tables']['performance_results']['Row'] & {
  // UI aliases / computed
  roi_pct?: number; // map to return_pct
  drawdown_pct?: number; // map to drawdown
};

// ---------------------------------------------------------------------------
// UI-only Helper Types (not directly mapped to a single table)
// ---------------------------------------------------------------------------

export interface QA {
  question: string;
  answer: string;
}

export interface LongPlanOffer {
  duration: string;
  price: number;
  discount: string;
}

// System and other types
export type SystemLog = Database['public']['Tables']['system_logs']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type Commission = Database['public']['Tables']['commissions']['Row'];
export type NotificationQueue = Database['public']['Tables']['notification_queue']['Row'];
export type AffiliateCode = Database['public']['Tables']['affiliate_codes']['Row'];
export type Consultation = Database['public']['Tables']['consultations']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type UserAccess = Database['public']['Tables']['user_access']['Row'];
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];

// Alias for backward compatibility
export type ContentPost = Blog;
export type CourseLesson = Lesson;
