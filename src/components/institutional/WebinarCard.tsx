import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Webinar } from '@/types';

// Extend local Webinar type representation to support co-branding fields
interface ExtendedWebinar extends Webinar {
  co_brand_name?: string;
  co_brand_logo?: string;
  co_brand_banner?: string;
  speaker_role?: string;
  speaker_profile_url?: string;
}

// ── COMING SOON PITCH MODE (REMOVE THIS BLOCK TO RESTORE REAL MODEL) ──
const IS_COMING_SOON_PITCH = true;

export function WebinarCard({ webinar }: Readonly<{ webinar: Webinar }>) {
  const navigate = useNavigate();
  const { isEnabled: isRegistrationOpen } = useFeatureFlag('webinar_registration_open', true);
  const isLive = webinar.status === 'live' && !!webinar.streaming_url;
  const isRecorded = webinar.status === 'past';

  const partnerName = webinar.metadata?.partner_name || webinar.metadata?.co_brand_name || (webinar.brand_logo_url ? "B2B Partner" : "");
  const partnerLogo = webinar.brand_logo_url;
  const hasSponsor = (Array.isArray(webinar.sponsor_logos) && webinar.sponsor_logos.length > 0) || (Array.isArray(webinar.metadata?.sponsors) && webinar.metadata.sponsors.length > 0);

  const renderStatusBadge = () => {
    if (IS_COMING_SOON_PITCH) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-blue-600/10 text-[#0071e3] text-[8px] font-black uppercase tracking-widest border border-blue-500/20">
          COMMENCING SOON
        </span>
      );
    }
    if (isLive) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[8px] font-black uppercase tracking-widest animate-pulse border border-red-500/30">
          LIVE NOW
        </span>
      );
    }
    if (isRecorded) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 text-zinc-400 text-[8px] font-black uppercase tracking-widest border border-zinc-800 backdrop-blur-md">
          ARCHIVED
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-[#0071e3] text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10">
        UPCOMING
      </span>
    );
  };

  const attendees = webinar.registration_count || 0;
  const maxSeats = webinar.max_attendees || 500;

  const getButtonContent = () => {
    if (IS_COMING_SOON_PITCH) return 'Commencing Soon';
    if (!isRegistrationOpen) return 'Registration Offline';
    if (attendees >= maxSeats) return 'Capacity Reached';
    return isLive ? 'Join Live Stream' : 'Reserve Spot';
  };
  
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const duration = "60 MINS";

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => navigate(`/webinars/${webinar.id}`)}
      className="group relative rounded-3xl bg-neutral-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-black/60 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      {/* Event Cover Image */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <img 
          src={webinar.webinar_image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {renderStatusBadge()}
        </div>

        {/* Co-Branding or Collaboration Badge */}
        {partnerName && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-black text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <HeartHandshake className="w-2.5 h-2.5 text-black" />
            Partnered
          </div>
        )}

        {/* Dynamic Sponsor Badge */}
        {hasSponsor && !partnerName && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-md text-zinc-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
            Sponsored
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          
          {/* Brand/Partner Collateral Display */}
          {partnerName && (
            <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-2">
              {partnerLogo ? (
                <img src={partnerLogo} alt="Partner Logo" className="h-3.5 w-auto object-contain opacity-80" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
              <span className="text-[8px] font-bold text-amber-500/80 uppercase tracking-widest">In Collaboration With {partnerName}</span>
            </div>
          )}

          <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight group-hover:text-emerald-400 transition-colors duration-300">
            {webinar.title}
          </h3>

          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 font-medium">
            {webinar.description}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800/60">
          {/* Metadata Grid */}
          <div className="flex flex-wrap gap-4 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#0071e3]" />
              <span>{formatDate(webinar.date_time)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#0071e3]" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#0071e3]" />
              <span>{attendees}/{maxSeats} Seats</span>
            </div>
          </div>

          {/* Lead/Speaker Info */}
          <div className="flex items-center gap-3 pt-1">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-zinc-800">
              <img 
                src={webinar.speaker_profile_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200?auto=format&fit=crop"} 
                alt={webinar.speaker_name || "Lead Strategist"}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-white uppercase tracking-wider truncate">
                {webinar.speaker_name || "Institutional Lead"}
              </p>
              <p className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest truncate">
                {webinar.speaker_role || "Senior FX Analyst"}
              </p>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="pt-1">
            {isRecorded ? (
              <button 
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] font-black uppercase tracking-widest transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  webinar.recording_url && globalThis.open(webinar.recording_url, '_blank');
                }}
              >
                Analyze Recording
              </button>
            ) : (
              <button 
                className={`w-full py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  isLive 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/15' 
                    : 'bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-lg shadow-blue-500/10'
                }`}
                disabled={!isRegistrationOpen || attendees >= maxSeats}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/webinars/${webinar.id}`);
                }}
              >
                {getButtonContent()}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
