import { supabase } from "@/lib/supabase";
import { setFlags } from "./featureFlags";
import { retentionEngine } from "../services/crm/retentionEngine";

export const loadSystem = async () => {
  try {
    const { data } = await supabase.from("feature_flags").select("*");
    if (data) {
      setFlags(data);
    }

    // 1. CRM Retention Pulse (Phase 5)
    // Run inactivity detection silently in background
    retentionEngine.detectInactivity().catch();

    // 2. High-fidelity real-time feature signal synchronization
    supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags'
        },
        async () => {
          const { data: updated } = await supabase.from("feature_flags").select("*");
          if (updated) {
            setFlags(updated);
          }
        }
      )
      .subscribe();
      
  } catch (err) {
    console.error("Institutional System Recovery: Feature signals failed to synchronize.", err);
  }
};
