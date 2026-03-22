/**
 * Global Type Definitions
 * Ensures type safety across the IFXTrades platform.
 */

export interface QA {
  question: string;
  answer: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'agent';
  full_name?: string;
  referred_by?: string;
  created_at: string;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  date_time: string;
  speaker?: string;
  speaker_name?: string;
  speaker_profile_url?: string;
  brand_logo_url?: string;
  webinar_image_url?: string;
  sponsor_logos?: string[];
  speaker_images?: string[];
  about_content?: string;
  q_and_a?: QA[];
  advanced_features?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  registration_count: number;
  max_attendees: number;
  status: 'upcoming' | 'live' | 'past' | 'recorded';
  is_paid?: boolean;
  price?: number;
  duration?: string;
}

export interface Signal {
  id: string;
  title: string;
  body: string;
  content_type: 'signal';
  status: 'published' | 'draft';
  data: {
    entry: number;
    sl: number;
    tp: number;
    pair: string;
    action: 'BUY' | 'SELL';
  };
  published_at: string;
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  strategy_type: string;
  risk_level: 'Low' | 'Medium' | 'High';
  monthly_price: number;
  yearly_price: number;
  performance_data?: { type: 'text' | 'image'; content: string }[];
  created_at: string;
}

export interface AgentAccount {
  id: string;
  user_id: string;
  agent_code: string; // e.g., alex01
  commission_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface SaleTracking {
  id: string;
  agent_id: string;
  user_id: string;
  product_id: string;
  sale_amount: number;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  bold_headline: string;
  content: string;
  image_url: string;
  video_url?: string;
  author_name: string;
  author_profile_url: string;
  author_bio: string;
  category: string;
  created_at: string;
  slug?: string;
  metadata?: Record<string, any>;
  published_at?: string;
}

export interface Review {
  id?: string;
  name: string;
  user_name: string;
  rating: number;
  comment: string;
  text?: string;
  image_url?: string;
  region?: string;
  role?: string;
  date?: string;
  created_at?: string;
}

export interface LongPlanOffer {
  duration: string; // e.g., "1 Year"
  price: number;
  discount: string; // e.g., "20% Off"
}

export interface Product {
  id: string;
  name: string;
  description: string;
  type?: string;
  price: number;
  image_url: string;
  strategy_details: string;
  risk_profile: string;
  performance_data: { type: 'text' | 'image'; content: string }[];
  strategy_graph_url: string;
  backtesting_result_url: string;
  video_explanation_url: string;
  long_plan_offers: LongPlanOffer[];
  reviews: Review[];
  q_and_a: QA[];
  category: string;
  terms_and_conditions: string;
}

export interface Chapter {
  id: string;
  title: string;
  video_url: string;
  is_free: boolean;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  image_url: string;
  duration: string;
  price: number;
  chapters: Chapter[];
  instructor_name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}
