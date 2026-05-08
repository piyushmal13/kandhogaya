import type { Database } from './database.types';

// Re-export utility types
export type { Json } from './database.types';

// ---------------------------------------------------------------------------
// Database-derived Core Entities
// ---------------------------------------------------------------------------

export type User = Database['public']['Tables']['users']['Row'];

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  image_url: string | null;
  risk_classification?: string;
  monthly_roi_pct?: number;
  min_capital?: number;
  is_active?: boolean;
  slug?: string;
  type?: 'algorithm' | 'course';
  performance?: {
    winRate: number;
    monthlyReturn: number;
  };
  video_explanation_url?: string;
  strategy_details?: string;
  images?: string[];
  terms_and_conditions?: string;
  risk_profile?: string;
  backtesting_result_url?: string;
  strategy_graph_url?: string;
  performance_data?: any;
  reviews?: any;
  q_and_a?: any;
  long_plan_offers?: any;
};

export type Webinar = any;

export type WebinarSponsor = Database['public']['Tables']['webinar_sponsors']['Row'];

export type Intelligence = any; // fallback for signals if table missing
export type Signal = any;

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

export type BotLicense = any & {
  algo?: any;
  user?: User;
};

export type WebinarRegistration = Database['public']['Tables']['webinar_registrations']['Row'] & {
  email?: string;
  attended?: boolean;
  payment_status?: string;
};

export type MarketPair = any;

export type ProductVariant = any;

export type FeatureFlag = any;

export type PerformanceResult = any & {
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
export type SystemLog = any;
export type AuditLog = any;
export type Commission = any;
export type NotificationQueue = any;
export type AffiliateCode = any;
export type Consultation = any;
export type Subscription = any;
export type UserAccess = any;
export type AnalyticsEvent = any;

// Alias for backward compatibility
export type ContentPost = Blog;
export type CourseLesson = Lesson;
