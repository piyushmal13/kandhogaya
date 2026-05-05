import { Intelligence as Signal, Webinar, Review } from '../types';

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
  speaker: raw.speaker_name || 'Institutional Lead',
  speaker_name: raw.speaker_name || '',
  date_time: raw.date_time,
  is_paid: raw.type === 'paid' || !!raw.is_paid,
  price: Number(raw.price) || 0,
  registration_count: Number(raw.registration_count) || 0,
  max_attendees: Number(raw.max_attendees) || 500,
  status: raw.status || 'upcoming',
  metadata: typeof raw.metadata === 'string' ? JSON.parse(raw.metadata) : (raw.metadata || {}),
  created_at: raw.created_at,
  speaker_images: Array.isArray(raw.speaker_images) && raw.speaker_images.length > 0 ? raw.speaker_images : [
    raw.speaker_profile_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop"
  ],
  webinar_image_url: raw.webinar_image_url || "https://images.unsplash.com/photo-1591696208162-a93795a74838?q=80&w=2070&auto=format&fit=crop",
  sponsor_logos: Array.isArray(raw.sponsor_logos) ? raw.sponsor_logos : [],
  sponsors: Array.isArray(raw.sponsors) && raw.sponsors.length > 0 
    ? raw.sponsors.map((s: any) => ({
        id: s.id,
        webinar_id: s.webinar_id,
        name: s.name,
        tier: s.tier,
        logo_url: s.logo_url,
        website_url: s.website_url
      }))
    : (raw.brand_logo_url 
        ? [{ id: "sp-main", name: "Lead Partner", tier: "Headline", logo_url: raw.brand_logo_url }] 
        : [{ id: "sp-1", name: "IFX Intelligence", tier: "Headline", logo_url: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg" }]
      ),
  q_and_a: Array.isArray(raw.q_and_a) && raw.q_and_a.length > 0 ? raw.q_and_a : [
    { question: "Will recordings be provided?", answer: "Yes, all registered attendees receive full institutional playback access for 30 days." },
    { question: "Is this suitable for retail traders?", answer: "This is advanced institutional methodology, but broken down so independent retail traders can execute it." },
    { question: "Do I need MT4 or MT5 to apply this?", answer: "The frameworks are platform agnostic, though examples will predominantly feature MT5 and Binance execution." }
  ],
  recording_url: raw.recording_url,
  streaming_url: raw.streaming_url,
  about_content: raw.about_content,
  advanced_features: typeof raw.advanced_features === 'string' ? JSON.parse(raw.advanced_features) : (raw.advanced_features || {}),
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

export const mapReview = (raw: any): Review => ({
  id: raw.id,
  name: raw.name || 'Anonymous Node',
  role: raw.role || 'Institutional Trader',
  text: raw.text || '',
  rating: Number(raw.rating) || 5,
  created_at: raw.created_at,
  image_url: raw.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(raw.name || 'A')}&background=10b981&color=fff`,
  region: raw.region || 'Global',
  status: raw.status || 'pending',
  priority: Number(raw.priority) || 0,
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
