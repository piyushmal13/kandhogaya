import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Video, Calendar, ArrowRight, Play, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { EliteButton } from '@/components/ui/Button';

interface WebinarSession {
  id: string;
  title: string;
  date_time: string;
  status: string;
  speaker_name: string;
  registration_id?: string;
}

/**
 * WebinarAccessPanel (v1.0)
 * 
 * Integrated research session portal for the elite dashboard.
 * Shows upcoming sessions and those the user is registered for.
 */
export function WebinarAccessPanel() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WebinarSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      
      try {
        // 1. Fetch upcoming/live webinars
        const { data: webinars, error: wError } = await supabase
          .from('webinars')
          .select('id, title, date_time, status, speaker_name')
          .neq('status', 'past')
          .order('date_time', { ascending: true })
          .limit(5);

        if (wError) throw wError;

        // 2. Fetch user registrations
        const { data: regs, error: rError } = await supabase
          .from('webinar_registrations')
          .select('webinar_id, id')
          .eq('user_id', user.id);

        if (rError) throw rError;

        const regMap = new Map(regs?.map(r => [r.webinar_id, r.id]) || []);

        const mapped = (webinars || []).map(w => ({
          ...w,
          registration_id: regMap.get(w.id)
        }));

        setSessions(mapped);
      } catch (err) {
        console.error("Dashboard Webinar Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  if (loading) return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 animate-pulse h-64" />
  );

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 flex items-center gap-3">
          <Video className="w-3.5 h-3.5 text-emerald-500" />
          Research Sessions
        </h3>
        <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
          Live Feed Active
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {sessions.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/5 rounded-3xl">
             <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">No Active Sessions Found</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              className="group/session p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-all duration-500"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{session.title}</h4>
                    {session.status === 'live' && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black uppercase animate-pulse">
                        <div className="w-1 h-1 rounded-full bg-red-500" />
                        Live
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                       <Clock size={12} className="text-emerald-500" />
                       {new Date(session.date_time).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                       <Calendar size={12} className="text-cyan-500" />
                       {session.speaker_name}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {session.registration_id ? (
                    <EliteButton 
                      variant="institutional-outline" 
                      size="sm" 
                      className="gap-2 px-4 border-emerald-500/20 text-emerald-400"
                      onClick={() => window.location.href = `/webinars/${session.id}`}
                    >
                       <Play size={12} fill="currentColor" />
                       Access
                    </EliteButton>
                  ) : (
                    <EliteButton 
                      variant="institutional-outline" 
                      size="sm" 
                      className="gap-2 px-4"
                      onClick={() => window.location.href = `/webinars/${session.id}`}
                    >
                       Join
                       <ArrowRight size={12} />
                    </EliteButton>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => window.location.href = '/webinars'}
        className="w-full mt-6 pt-6 border-t border-white/5 text-[9px] font-black text-white/30 hover:text-emerald-500 uppercase tracking-[0.4em] transition-all"
      >
        View Full Schedule
      </button>
    </div>
  );
}
