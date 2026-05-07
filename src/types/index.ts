import type { Database } from './database.types';

// Re-export utility types
export type { Json } from './database.types';

// ---------------------------------------------------------------------------
// Database-derived Core Entities
// ---------------------------------------------------------------------------

export type User = Database['public']['Tables']['users']['Row'];

export type Product = (Database['public']['Tables']['algorithms']['Row'] | any) & {
  slug?: string;
  monthly_roi_pct?: number;
  risk_classification?: string;
  min_capital?: number;
  performance?: any;
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

export type Intelligence = any; // fallback for signals if table missing
export type Signal = Intelligence;

export type Blog = (Database['public']['Tables']['blog_posts']['Row'] | any) & {
  body?: string;
  author_name?: string;
  content?: string; // legacy alias
  metadata?: any;
};

export type Course = (Database['public']['Tables']['university_courses']['Row'] | any) & {
  chapters?: any[];
  lessons?: any[];
};

export type Lesson = (Database['public']['Tables']['course_lessons']['Row'] | any);

export type Review = Database['public']['Tables']['reviews']['Row'];

export type Lead = any;

export type AgentAccount = any;

export type SaleTracking = any;

export type AlgoBot = any;

export type BotLicense = (Database['public']['Tables']['algo_licenses']['Row'] | any) & {
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
