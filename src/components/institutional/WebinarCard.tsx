import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { SovereignButton } from '@/components/ui/Button';

export interface Webinar {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO 8601
  endDate: string;
  duration: string; // "PT1H30M" format for Schema.org
  instructor: {
    name: string;
    avatar: string;
    credentials: string;
  };
  imageUrl: string;
  attendees: number;
  maxSeats: number;
  isPremium: boolean;
  status: 'upcoming' | 'live' | 'recorded';
  recordingUrl?: string;
  streaming_url?: string; // For live view
}

export function WebinarCard({ webinar }: { webinar: Webinar }) {
  const { isEnabled: isRegistrationOpen } = useFeatureFlag('webinar_registration_open', true);
  const isLive = webinar.status === 'live';
  const isRecorded = webinar.status === 'recorded';
  
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: webinar.title,
    startDate: webinar.startDate,
    endDate: webinar.endDate,
    duration: webinar.duration,
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
      name: webinar.instructor.name
    },
    image: webinar.imageUrl,
    description: webinar.description,
    offers: {
      '@type': 'Offer',
      price: webinar.isPremium ? '19.99' : '0',
      priceCurrency: 'USD',
      availability: isRegistrationOpen ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      validFrom: webinar.startDate
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5"
      itemScope
      itemType="https://schema.org/Event"
    >
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={webinar.imageUrl} 
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          itemProp="image"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {isLive ? (
            <span className="px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-widest animate-pulse border border-white/20">
              LIVE NOW
            </span>
          ) : isRecorded ? (
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
              ARCHIVED
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-black text-[10px] font-black uppercase tracking-widest">
              UPCOMING
            </span>
          )}
        </div>

        {/* Premium Badge */}
        {webinar.isPremium && (
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
            <time itemProp="startDate" dateTime={webinar.startDate}>
              {formatDate(webinar.startDate)}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span itemProp="duration">{webinar.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>{webinar.attendees}/{webinar.maxSeats} Units</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-4 pt-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/20">
            <img 
              src={webinar.instructor.avatar} 
              alt={webinar.instructor.name}
              className="w-full h-full object-cover"
              itemProp="performer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-white uppercase tracking-wider truncate" itemProp="organizer">
              {webinar.instructor.name}
            </p>
            <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest truncate">
              {webinar.instructor.credentials}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          {isRecorded ? (
            <SovereignButton 
              variant="secondary" 
              fluid
              className="rounded-2xl"
              trackingEvent="webinar_watch_recording"
              onClick={() => webinar.recordingUrl && window.open(webinar.recordingUrl, '_blank')}
            >
              Analyze Recording
            </SovereignButton>
          ) : (
            <SovereignButton 
              variant="sovereign" 
              fluid
              className="rounded-2xl"
              glowEffect={isLive}
              disabled={!isRegistrationOpen || webinar.attendees >= webinar.maxSeats}
              trackingEvent={`webinar_register_${webinar.id}`}
            >
              {!isRegistrationOpen ? 'Registration Offline' : 
               webinar.attendees >= webinar.maxSeats ? 'Capacity Reached' : 
               isLive ? 'Link to Session' : 'Claim Seat'}
            </SovereignButton>
          )}
        </div>
      </div>
    </motion.article>
  );
}
