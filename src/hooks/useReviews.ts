import { useState, useEffect, useCallback } from "react";
import { Review } from "../types";
import { reviewService } from "../services/admin/reviewService";

/**
 * useReviews Hook
 * Institutional Discovery: [Component -> Hook -> Service]
 * Centralized reputation control for the Sentiment Matrix.
 */
export const useReviews = (initialStatus?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<string | undefined>(initialStatus);
  const [rating, setRating] = useState<number | undefined>();

  const fetchReviews = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    const data = await reviewService.fetchReviews(pageNum, 20, status, rating);
    const stats = await reviewService.getReputationIntelligence();
    setReviews(data);
    setMetrics(stats);
    setPage(pageNum);
    setLoading(false);
  }, [status, rating]);

  useEffect(() => {
    fetchReviews(0);
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    metrics,
    page,
    status,
    rating,
    selectedIds,
    setSelectedIds,
    setStatus,
    setRating,
    refresh: () => fetchReviews(page),
    fetchPage: (n: number) => fetchReviews(n),
    
    // Commands
    approve: async (id: string, adminId: string) => {
      const success = await reviewService.approveReview(id, adminId);
      if (success) fetchReviews(page);
      return success;
    },
    
    reject: async (id: string, reason: string, adminId: string) => {
      const success = await reviewService.reject(id, reason, adminId);
      if (success) fetchReviews(page);
      return success;
    },

    setPriority: async (id: string, priority: number) => {
      const success = await reviewService.setPriority(id, priority);
      if (success) fetchReviews(page);
      return success;
    },

    bulkAction: async (action: 'approved' | 'rejected' | 'hidden', adminId: string) => {
      const success = await reviewService.massAction(selectedIds, action, adminId);
      if (success) {
        setSelectedIds([]);
        fetchReviews(page);
      }
      return success;
    },

    delete: async (id: string, adminId: string) => {
      const success = await reviewService.deleteReview(id, adminId);
      if (success) fetchReviews(page);
      return success;
    }
  };
};
