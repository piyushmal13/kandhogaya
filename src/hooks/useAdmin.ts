import { useState, useEffect, useCallback } from "react";
import { adminRevenueService, ExecutiveStats } from "../services/admin/adminRevenueService";
import { adminLogService, SystemLog } from "../services/admin/adminLogService";

/**
 * useAdmin Hook
 * Strict Capability: [Component -> Hook -> Service]
 * Centralized operational discovery for the Executive Terminal.
 */
export const useAdmin = () => {
  const [stats, setStats] = useState<ExecutiveStats>({
    revenueToday: 0,
    revenueMTD: 0,
    activeUsers: 0,
    conversionRate: 0,
    systemHealth: "Optimal"
  });
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const data = await adminRevenueService.getExecutiveIntelligence();
    setStats(data);
    setLoading(false);
  }, []);

  const fetchLogs = useCallback(async (page: number = 0, limit: number = 20) => {
    const data = await adminLogService.getLogs(page, limit);
    setLogs(data);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    logs,
    loading,
    refreshStats: fetchStats,
    fetchLogs
  };
};
