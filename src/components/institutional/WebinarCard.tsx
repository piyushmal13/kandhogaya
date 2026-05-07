import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, ShieldCheck } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Webinar } from '@/types';
import { getWebinarUrl, getAvatarUrl } from '@/lib/supabase';
import { ResizedImage } from '../ui/ResizedImage';

export function WebinarCard({ webinar }: Readonly<{ webinar: Webinar }>) {
  const navigate = useNavigate();
  const { isEnabled: isRegistrationOpen } = useFeatureFlag('webinar_registration_open', true);
  const isLive = webinar.status === 'live';
  const isRecorded = webinar.status === 'past'; // Global type uses 'past' instead of 'recorded'

  const hasSponsor = Array.isArray(webinar.sponsors) && webinar.sponsors.length > 0;

  const renderStatusBadge = () => {
    if (isLive) {
      return (
        <span className="px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-widest animate-pulse border border-white/20">
          LIVE NOW
        </span>
      );
    }
    if (isRecorded) {
      return (
        <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
          ARCHIVED
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-black text-[10px] font-black uppercase tracking-widest">
        UPCOMING
      </span>
    );
  };

  const attendees = webinar.registration_count || 0;
  const maxSeats = webinar.max_attendees || 500;

  const getButtonContent = () => {
    if (!isRegistrationOpen) return 'Registration Offline';
    if (attendees >= maxSeats) return 'Capacity Reached';
    return isLive ? 'Link to Session' : 'Claim Seat';
  };
  
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const endDate = new Date(new Date(webinar.date_time).getTime() + 3600000).toISOString();
  const duration = "PT1H";

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: webinar.title,
    startDate: webinar.date_time,
    endDate: endDate,
    duration: duration,
    eventStatus: isLive ? 'https://schema.org/EventLive' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: `https://ifxtrades.com/webinars/${webinar.id}`
    },
    organizer: {
      '@type': 'Organization',
      name: 'IFX Trades',
      url: 'https://ifxtrades.com'
    },
    performer: {
      '@type': 'Person',
      name: webinar.speaker_name || "Institutional Lead"
    },
    image: webinar.webinar_image_url || "",
    description: webinar.description,
    offers: {
      '@type': 'Offer',
      price: webinar.is_paid ? (webinar.price || '19.99').toString() : '0',
      priceCurrency: 'USD',
      availability: isRegistrationOpen ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      validFrom: webinar.date_time
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/webinars/${webinar.id}`)}
      className="group relative rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 cursor-pointer"
      itemScope
      itemType="https://schema.org/Event"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <ResizedImage 
          src={webinar.webinar_image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
          alt={webinar.title}
          bucket="webinar-assets"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          itemProp="image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {renderStatusBadge()}
        </div>

        {/* Sponsored Badge */}
        {hasSponsor && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded bg-white/5 border border-white/10 backdrop-blur-md text-white/40 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
            Sponsored
          </div>
        )}

        {/* Premium Badge */}
        {webinar.is_paid && !hasSponsor && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
            PREMIUM
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-black text-white leading-tight uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors" itemProp="name">
            {webinar.title}
          </h3>
        </div>

        <p className="text-xs text-white/40 leading-relaxed line-clamp-2 uppercase tracking-wide font-medium" itemProp="description">
          {webinar.description}
        </p>

        {/* Meta Data */}
        <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-white/60 py-4 border-y border-white/5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <time itemProp="startDate" dateTime={webinar.date_time}>
              {formatDate(webinar.date_time)}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span itemProp="duration">{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>{attendees}/{maxSeats} Units</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-4 pt-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
            <img 
              src={getAvatarUrl(webinar.speaker_images?.[0] || webinar.speaker_profile_url) || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop"} 
              alt={webinar.speaker_name || "Institutional Lead"}
              className="w-full h-full object-cover"
              itemProp="performer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-white uppercase tracking-wider truncate" itemProp="organizer">
              {webinar.speaker_name || "Institutional Lead"}
            </p>
            <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest truncate">
              Lead Strategist
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          {isRecorded ? (
            <button 
              className="btn-secondary w-full py-3.5 text-[10px]"
              onClick={(e) => {
                e.stopPropagation();
                webinar.recording_url && globalThis.open(webinar.recording_url, '_blank');
              }}
            >
              Analyze Recording
            </button>
          ) : (
            <button 
              className={`w-full py-3.5 text-[10px] ${isLive ? 'btn-primary shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'btn-primary opacity-90'}`}
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
    </motion.article>
  );
}
