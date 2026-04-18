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
        query = query.eq(column.trim(), value.trim().replaceAll(/['"]/g, ''));
      }
      
      const { data: initialData, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (!error) {
        setData((initialData as T[]) || []);
      }
      setLoading(false);
    };

    fetchInitial();

    // 2. LIVE SYNCHRONIZATION: Subscribe to change stream
    const handlePayload = (payload: RealtimePostgresChangesPayload<T>) => {
      setData((current) => {
        const safeCurrent = Array.isArray(current) ? current : [];
        
        // Hardening: Defensive checks for payload integrity
        if (!payload || (!payload.new && !payload.old)) return safeCurrent;

        if (payload.eventType === 'INSERT' && payload.new) {
          return [payload.new, ...safeCurrent].slice(0, 50);
        }
        if (payload.eventType === 'UPDATE' && payload.new) {
          return safeCurrent.map(item => item.id === payload.new.id ? payload.new : item);
        }
        if (payload.eventType === 'DELETE' && payload.old) {
          return safeCurrent.filter(item => item.id !== payload.old.id);
        }
        return safeCurrent;
      });
      
      if (onUpdate) onUpdate(payload);
    };

    const channel = supabase
      .channel(`${table}_realtime_${filter?.replaceAll(/[^a-zA-Z0-9]/g, '_') || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        handlePayload
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);

  return { data: Array.isArray(data) ? data : [], loading };
}
