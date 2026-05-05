import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getReviews } from '@/services/apiHandlers';

import { useFeatureFlag } from '@/hooks/useFeatureFlag';

export const EliteSocialProof = () => {
  const { isEnabled: isReviewsLive } = useFeatureFlag('institutional_reviews_live', true);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isReviewsLive) {
      setIsLoading(false);
      return;
    }
    const fetchMembers = async () => {
      try {
        const data = await getReviews(8);
        if (data && data.length > 0) {
          setMembers(data);
        }
      } catch (err) {
        console.error("Institutional Social Proof: Signal lost.", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (isLoading || !isReviewsLive) return null;
  if (members.length === 0) return null;
  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">
                 Global Node Intelligence
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight italic uppercase">
                 Synchronized <br />
                 <span className="text-emerald-400">Social Proof.</span>
              </h2>
              <p className="text-lg text-white/40 leading-relaxed font-medium max-w-xl">
                 Real-time feedback from our elite network of institutional traders. Verified execution results and strategy performance validated by the IFX research desk across global hubs.
              </p>
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {members.map(member => (
                   <div key={member.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 hover:border-emerald-500/20 transition-all group">
                      <div className="flex items-center justify-between">
                         <div className="text-[9px] font-black uppercase tracking-widest text-white/60">{member.name}</div>
                         <div className="text-[8px] font-black uppercase tracking-widest text-emerald-500/40">{member.region || member.location}</div>
                      </div>
                      <p className="text-[10px] text-white/30 leading-relaxed italic">"{member.feedback || member.text}"</p>
                   </div>
                ))}
             </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full opacity-30" />
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
               <img 
                 src="/brain/efc31965-26c1-4320-a414-7f19a27d9e96/whatsapp_elite_reviews_1777796305862.png" 
                 alt="Elite WhatsApp Reviews" 
                 className="w-full h-auto grayscale-[20%] hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
