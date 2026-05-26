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

export function WebinarCard({ webinar }: Readonly<{ webinar: ExtendedWebinar }>) {
  const navigate = useNavigate();
  const { isEnabled: isRegistrationOpen } = useFeatureFlag('webinar_registration_open', true);
  const isLive = webinar.status === 'live' && !!webinar.streaming_url;
  const isRecorded = webinar.status === 'past';

  const hasSponsor = Array.isArray(webinar.sponsors) && webinar.sponsors.length > 0;

  const renderStatusBadge = () => {
    if (isLive) {
      return (
        <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse border border-white/20">
          LIVE NOW
        </span>
      );
    }
    if (isRecorded) {
      return (
        <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[9px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
          ARCHIVED
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 rounded-full bg-emerald-500/80 text-black text-[9px] font-black uppercase tracking-widest">
        UPCOMING
      </span>
    );
  };

  const attendees = webinar.registration_count || 0;
  const maxSeats = webinar.max_attendees || 500;

  const getButtonContent = () => {
    if (!isRegistrationOpen) return 'Registration Offline';
    if (attendees >= maxSeats) return 'Capacity Reached';
    return isLive ? 'Join Live Session' : 'Reserve Spot';
  };
  
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const duration = "PT1H";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/webinars/${webinar.id}`)}
      className="group relative rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden hover:border-emerald-500/35 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 cursor-pointer flex flex-col h-full"
    >
      {/* Event Cover Image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={webinar.webinar_image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {renderStatusBadge()}
        </div>

        {/* Co-Branding or Collaboration Badge */}
        {webinar.co_brand_name && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-black text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
            <HeartHandshake className="w-3 h-3 text-black" />
            B2B Partner
          </div>
        )}

        {/* Dynamic Sponsor Badge */}
        {hasSponsor && !webinar.co_brand_name && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/40 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
            Sponsored
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          
          {/* Brand/Partner Collateral Display */}
          {webinar.co_brand_name && (
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              {webinar.co_brand_logo ? (
                <img src={webinar.co_brand_logo} alt="Partner Logo" className="h-4 w-auto object-contain opacity-70" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-amber-500" />
              )}
              <span className="text-[9px] font-black text-amber-400/80 uppercase tracking-[0.2em]">In Collaboration With {webinar.co_brand_name}</span>
            </div>
          )}

          <h3 className="text-xl font-black text-white leading-tight uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors">
            {webinar.title}
          </h3>

          <p className="text-xs text-white/35 leading-relaxed line-clamp-2 uppercase tracking-wide font-medium">
            {webinar.description}
          </p>
        </div>

        <div className="space-y-6 pt-4 border-t border-white/5">
          {/* Metadata Grid */}
          <div className="flex flex-wrap gap-4 text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-white/55">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>{formatDate(webinar.date_time)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>{attendees}/{maxSeats} Units</span>
            </div>
          </div>

          {/* Lead/Speaker Info */}
          <div className="flex items-center gap-3 pt-2">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
              <img 
                src={webinar.speaker_profile_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200?auto=format&fit=crop"} 
                alt={webinar.speaker_name || "Lead Strategist"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">
                {webinar.speaker_name || "Institutional Lead"}
              </p>
              <p className="text-[8px] font-medium text-white/20 uppercase tracking-widest truncate">
                {webinar.speaker_role || "Senior FX Analyst"}
              </p>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="pt-2">
            {isRecorded ? (
              <button 
                className="btn-secondary w-full py-3.5 text-[9px] font-black uppercase tracking-widest"
                onClick={(e) => {
                  e.stopPropagation();
                  webinar.recording_url && globalThis.open(webinar.recording_url, '_blank');
                }}
              >
                Analyze Recording
              </button>
            ) : (
              <button 
                className={`w-full py-3.5 text-[9px] font-black uppercase tracking-widest ${isLive ? 'btn-primary shadow-[0_0_20px_rgba(16,185,129,0.25)]' : 'btn-primary'}`}
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
