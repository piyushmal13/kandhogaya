import { Signal, Webinar } from '../types';

/**
 * Institutional Data Mapping Layer
 * 
 * Maps raw Supabase / Postgres responses into standardized platform types.
 * Ensures consistent UI rendering regardless of backend schema changes.
 */

export const mapSignal = (raw: any): Signal => ({
  id: raw.id,
  type: raw.type || 'TRADE',
  symbol: raw.symbol?.toUpperCase() || raw.asset?.toUpperCase() || 'UNKNOWN',
  asset: raw.asset || '',
  direction: raw.direction || 'BUY',
  entry: Number(raw.entry || raw.entry_price) || 0,
  stop_loss: Number(raw.stop_loss) || 0,
  take_profit: Number(raw.take_profit) || 0,
  status: raw.status || 'pending',
  created_at: raw.created_at,
  metadata: typeof raw.metadata === 'string' ? JSON.parse(raw.metadata) : (raw.metadata || {}),
  result: raw.result || null,
  pips: Number(raw.pips) || 0,
});

export const mapWebinar = (raw: any): Webinar => ({
  id: raw.id,
  title: raw.title || 'Untitled Session',
  description: raw.description || '',
  speaker: raw.speaker || raw.speaker_name || 'Institutional Lead',
  speaker_name: raw.speaker_name || '',
  date_time: raw.date_time,
  is_paid: Boolean(raw.is_paid),
  price: Number(raw.price) || 0,
  registration_count: Number(raw.registration_count) || 0,
  max_attendees: Number(raw.max_attendees) || 500,
  status: raw.status || 'upcoming',
  metadata: typeof raw.metadata === 'string' ? JSON.parse(raw.metadata) : (raw.metadata || {}),
  created_at: raw.created_at,
  speaker_images: Array.isArray(raw.speaker_images) ? raw.speaker_images : [],
  sponsor_logos: Array.isArray(raw.sponsor_logos) ? raw.sponsor_logos : [],
});

export const mapLead = (raw: any): any => ({
  id: raw.id,
  name: raw.name || 'Anonymous Prospect',
  email: raw.email || '',
  status: raw.status || 'cold',
  source: raw.source || 'Direct',
  created_at: raw.created_at,
  revenue_mtd: Number(raw.revenue_mtd) || 0,
  ltv_projected: Number(raw.ltv_projected) || 0,
  last_active_symbol: raw.last_active_symbol || null,
  engagement_score: Number(raw.engagement_score) || 0,
  metadata: typeof raw.metadata === 'string' ? JSON.parse(raw.metadata) : (raw.metadata || {}),
});

export const mapMarketTicker = (raw: any): any => ({
  id: raw.id,
  symbol: raw.symbol?.toUpperCase() || '',
  price: Number(raw.price) || 0,
  change: Number(raw.change) || 0,
  change_percent: Number(raw.change_percent) || 0,
  volume: Number(raw.volume) || 0,
  last_updated: raw.last_updated || raw.updated_at,
  high_24h: Number(raw.high_24h) || 0,
  low_24h: Number(raw.low_24h) || 0,
});
