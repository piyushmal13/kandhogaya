import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * useRealtime - Institutional Live Data Stream
 * High-performance hook for real-time table synchronization.
 * Automatically handles subscription lifecycle and state merging.
 */
export function useRealtime<T extends { id: string | number }>(
  table: string,
  filter?: string,
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. INITIAL DISCOVERY: Fetch baseline state
    const fetchInitial = async () => {
      let query = supabase.from(table).select("*");
      if (filter) {
        // Simple equality filter for now
        const [column, value] = filter.split('=');
        query = query.eq(column.trim(), value.trim().replace(/['"]/g, ''));
      }
      
      const { data: initialData, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (!error && initialData) {
        setData(initialData as T[]);
      }
      setLoading(false);
    };

    fetchInitial();

    // 2. LIVE SYNCHRONIZATION: Subscribe to change stream
    const channel = supabase
      .channel(`realtime_${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload: RealtimePostgresChangesPayload<T>) => {
          setData((current) => {
            if (payload.eventType === 'INSERT') {
              return [payload.new, ...current].slice(0, 50);
            }
            if (payload.eventType === 'UPDATE') {
              return current.map(item => item.id === payload.new.id ? payload.new : item);
            }
            if (payload.eventType === 'DELETE') {
              return current.filter(item => item.id !== payload.old.id);
            }
            return current;
          });
          
          if (onUpdate) onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);

  return { data, loading };
}
