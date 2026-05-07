import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface HealthStatus {
  db_connected: boolean;
  error_rate: number;
  status: "OPTIMAL" | "DEGRADED" | "DOWN";
}

/**
 * useHealth Hook
 * Institutional Monitoring: Real-time system health discovery.
 */
export const useHealth = () => {
  const [health, setHealth] = useState<HealthStatus>({
    db_connected: false,
    error_rate: 0,
    status: "OPTIMAL"
  });

  const checkHealth = useCallback(async () => {
    try {
      const { error } = await supabase.from('feature_flags').select('id').limit(1);

      if (error) throw error;

      setHealth({
        db_connected: true,
        error_rate: 0, // Injected via Error Service later
        status: "OPTIMAL"
      });
    } catch (err) {
      console.error("[HealthEngine] Connection Failure:", err);
      setHealth({
        db_connected: false,
        error_rate: 100,
        status: "DOWN"
      });
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return { health, refresh: checkHealth };
};
