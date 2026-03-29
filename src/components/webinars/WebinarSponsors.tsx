import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  tier: 'Headline' | 'Partner';
  logo_url: string;
  website_url?: string;
}

interface WebinarSponsorsProps {
  sponsors: Sponsor[];
}

export const WebinarSponsors = ({ sponsors }: WebinarSponsorsProps) => {
  if (!sponsors || sponsors.length === 0) return null;

  const headlineSponsors = sponsors.filter(s => s.tier === 'Headline');
  const partnerSponsors = sponsors.filter(s => s.tier === 'Partner');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Headline Sponsors */}
      {headlineSponsors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Headline Presentation
          </div>
          <div className="flex flex-wrap gap-6">
            {headlineSponsors.map((sponsor) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-white" />
                </div>
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name} 
                  className="h-12 w-auto object-contain brightness-100 contrast-125 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">
                  {sponsor.name}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Partner Sponsors */}
      {partnerSponsors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Official Platform Partners
          </div>
          <div className="flex flex-wrap gap-4">
            {partnerSponsors.map((sponsor) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="group flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 hover:border-white/20 transition-all"
              >
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name} 
                  className="h-6 w-auto object-contain opacity-40 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white">
                  {sponsor.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
