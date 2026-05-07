import type { Database } from './database.types';

// Re-export utility types
export type { Json } from './database.types';

// ---------------------------------------------------------------------------
// Database-derived Core Entities
// ---------------------------------------------------------------------------

export type User = Database['public']['Tables']['users']['Row'];

export type Product = any;

export type Webinar = any;

export type WebinarSponsor = Database['public']['Tables']['webinar_sponsors']['Row'];

export type Intelligence = any; // fallback for signals if table missing
export type Signal = Intelligence;

export type Blog = any;

export type Course = any & {
  chapters?: any[];
  lessons?: any[];
};

export type Lesson = any;

export type Review = any;

export type Lead = any;

export type AgentAccount = any;

export type SaleTracking = any;

export type AlgoBot = any;

export type BotLicense = (Database['public']['Tables']['bot_licenses']['Row'] | any) & {
  algo?: any;
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
export type AuditLog = any;
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
