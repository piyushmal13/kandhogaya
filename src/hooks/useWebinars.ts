import { useQuery } from '@tanstack/react-query';
import { useFeatureFlag } from './useFeatureFlag';
import { webinarService } from '@/services/webinarService';
import { Webinar } from '@/types';

export function useWebinars() {
  const { isEnabled: enableRealtime } = useFeatureFlag('webinar_realtime_updates', true);

  return useQuery({
    queryKey: ['webinars'],
    queryFn: async () => {
      return await webinarService.getWebinars();
    },
    refetchInterval: enableRealtime ? 30000 : false, // Poll every 30s if enabled
    staleTime: 60000, // 1 minute
  });
}

export function useLiveWebinar() {
  return useQuery({
    queryKey: ['webinars', 'live'],
    queryFn: async () => {
      const webinars = await webinarService.getWebinars();
      return webinars.find(w => w.status === 'live') || null;
    },
    refetchInterval: 5000, // Aggressive polling for live status
  });
}
