import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface HealthStatus {
  db_connected: boolean;
  api_latency: number;
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
    api_latency: 0,
    error_rate: 0,
    status: "OPTIMAL"
  });

  const checkHealth = useCallback(async () => {
    const start = Date.now();
    try {
      const { error } = await supabase.from('feature_flags').select('id').limit(1);
      const latency = Date.now() - start;

      if (error) throw error;

      setHealth({
        db_connected: true,
        api_latency: latency,
        error_rate: 0, // Injected via Error Service later
        status: latency < 500 ? "OPTIMAL" : "DEGRADED"
      });
    } catch (err) {
      console.error("[HealthEngine] Connection Failure:", err);
      setHealth({
        db_connected: false,
        api_latency: 0,
        error_rate: 100,
        status: "DOWN"
      });
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // 30s Pulse
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { health, refresh: checkHealth };
};
