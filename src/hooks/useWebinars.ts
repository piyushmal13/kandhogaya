import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useFeatureFlag } from './useFeatureFlag';

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
  streaming_url?: string;
}

export function useWebinars() {
  const { isEnabled: enableRealtime } = useFeatureFlag('webinar_realtime_updates', true);

  return useQuery({
    queryKey: ['webinars'],
    queryFn: async () => {
      // Mapping Supabase table columns to the institutional interface
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .order('date_time', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(w => ({
        id: w.id,
        title: w.title,
        description: w.description,
        startDate: w.date_time,
        endDate: new Date(new Date(w.date_time).getTime() + 3600000).toISOString(),
        duration: "PT1H",
        instructor: {
          name: w.speaker_name || "IFX Analyst",
          avatar: w.speaker_profile_url || "",
          credentials: "Lead Strategist"
        },
        imageUrl: w.webinar_image_url || "",
        attendees: w.registration_count || 0,
        maxSeats: w.max_attendees || 100,
        isPremium: w.is_paid || false,
        status: w.status || 'upcoming',
        recordingUrl: w.recording_url,
        streaming_url: w.streaming_url
      })) as Webinar[];
    },
    refetchInterval: enableRealtime ? 30000 : false, // Poll every 30s if enabled
    staleTime: 60000, // 1 minute
  });
}

export function useLiveWebinar() {
  return useQuery({
    queryKey: ['webinars', 'live'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .eq('status', 'live')
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: data.date_time,
        endDate: new Date(new Date(data.date_time).getTime() + 3600000).toISOString(),
        duration: "PT1H",
        instructor: {
          name: data.speaker_name || "IFX Analyst",
          avatar: data.speaker_profile_url || "",
          credentials: "Lead Strategist"
        },
        imageUrl: data.webinar_image_url || "",
        attendees: data.registration_count || 0,
        maxSeats: data.max_attendees || 100,
        isPremium: data.is_paid || false,
        status: data.status || 'live',
        recordingUrl: data.recording_url,
        streaming_url: data.streaming_url
      } as Webinar;
    },
    refetchInterval: 5000, // Aggressive polling for live status
  });
}
