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
  speaker_images: Array.isArray(raw.speaker_images) && raw.speaker_images.length > 0 ? raw.speaker_images : [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop"
  ],
  sponsor_logos: Array.isArray(raw.sponsor_logos) ? raw.sponsor_logos : [],
  sponsors: Array.isArray(raw.sponsors) && raw.sponsors.length > 0 ? raw.sponsors : [
    { id: "sp-1", webinar_id: raw.id, name: "Binance", tier: "Headline", logo_url: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg" },
    { id: "sp-2", webinar_id: raw.id, name: "TradingView", tier: "Partner", logo_url: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1481103649/k4c5p4t2gqjymnld10c9.png" },
    { id: "sp-3", webinar_id: raw.id, name: "MetaTrader 4", tier: "Co-Sponsor", logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/23/MetaTrader_4_logo.png" }
  ],
  q_and_a: Array.isArray(raw.q_and_a) && raw.q_and_a.length > 0 ? raw.q_and_a : [
    { question: "Will recordings be provided?", answer: "Yes, all registered attendees receive full institutional playback access for 30 days." },
    { question: "Is this suitable for retail traders?", answer: "This is advanced institutional methodology, but broken down so independent retail traders can execute it." },
    { question: "Do I need MT4 or MT5 to apply this?", answer: "The frameworks are platform agnostic, though examples will predominantly feature MT5 and Binance execution." }
  ],
  recording_url: raw.recording_url,
  streaming_url: raw.streaming_url,
});

export const mapLead = (raw: any): any => ({
  id: raw.id,
  email: raw.email || '',
  name: raw.name || raw.crm_metadata?.name || raw.email?.split('@')[0] || 'Anonymous',
  source: raw.source || 'Organic Discovery',
  created_at: raw.created_at,
  stage: raw.stage || 'NEW',
  status: raw.stage || 'NEW', // compatibility
  score: Number(raw.score) || 0,
  is_hot: Boolean(raw.is_hot),
  last_action_at: raw.last_action_at,
  conversion_probability: Number(raw.conversion_probability) || 0,
  priority_tag: raw.priority_tag || 'Standard',
  referred_by_code: raw.referred_by_code,
  assigned_to: raw.assigned_to,
  crm_metadata: typeof raw.crm_metadata === 'string' ? JSON.parse(raw.crm_metadata) : (raw.crm_metadata || {}),
  metadata: typeof raw.metadata === 'string' ? JSON.parse(raw.metadata) : (raw.metadata || {}),
  active_licenses: Array.isArray(raw.bot_licenses) ? raw.bot_licenses.length : 0,
  webinar_count: Array.isArray(raw.webinar_registrations) ? raw.webinar_registrations.length : 0,
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
