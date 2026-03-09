/**
 * Global Type Definitions
 * Ensures type safety across the IFXTrades platform.
 */

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
  is_paid?: boolean;
  price?: number;
  status: 'upcoming' | 'live' | 'recorded';
  registration_count: number;
  max_attendees: number;
  metadata?: any;
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
  performance_data?: any;
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
