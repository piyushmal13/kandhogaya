import { useState, useEffect, useCallback } from "react";
import { leadService, Lead } from "../services/crm/leadService";

/**
 * useCRM Hook
 * Strict Capability: [Component -> Hook -> Service]
 * Centralized prospect discovery for the Lead Acquisition matrix.
 */
export const useCRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchLeads = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    const data = await leadService.getLeads(pageNum, 20);
    setLeads(data);
    setPage(pageNum);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads(0);
  }, [fetchLeads]);

  return {
    leads,
    loading,
    page,
    refreshLeads: () => fetchLeads(page),
    fetchHistory: (n: number) => fetchLeads(n)
  };
};
