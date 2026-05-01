import { supabase } from "../../lib/supabase";
import { Review } from "../../types";

/**
 * Reputation Intelligence Hub
 * Institutional Analytics: trust, conversion, and fraud detection.
 */
export const reviewService = {
  /**
   * Discovers sentiment signals with intelligence filters.
   */
  fetchReviews: async (page: number = 0, limit: number = 20, status?: string, rating?: number) => {
    const offset = page * limit;
    let query = supabase
      .from('reviews')
      .select('id, user_id, rating, text, status, source, created_at, priority, ip_address, flagged, name, role, region')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (rating) query = query.eq('rating', rating);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Automates the priority weight system for conversion engineering.
   */
  calculatePriority: (rating: number, source?: string) => {
    if (rating >= 5 && source === "paid") return 10;
    if (rating >= 5) return 8;
    if (rating >= 4) return 6;
    if (rating >= 3) return 4;
    return 1;
  },

  /**
   * Fraud Detection: Discovers spam/duplicate signals before moderation.
   */
  detectFraud: async (userId: string, ip: string) => {
    const { data } = await supabase
      .from('reviews')
      .select('id')
      .or(`user_id.eq.${userId},ip_address.eq.${ip}`)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    return (data?.length || 0) > 2; // Flag if > 2 reviews in 24h
  },

  /**
   * Orchestrates high-stakes approval with CRM integration.
   */
  approveReview: async (id: string, adminId: string) => {
    const { data: review } = await supabase.from('reviews').select('id, rating, user_id').eq('id', id).single();
    if (!review) return false;

    const { error } = await supabase
      .from('reviews')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) throw error;

    // CRM Pulse: Improve Lead Score for Positive Sentiment
    if (review.rating >= 4 && review.user_id) {
       await supabase.rpc('update_lead_score', { 
         p_user_id: review.user_id, 
         p_increment: 15 
       });
    }

    await supabase.from('system_logs').insert({
      type: 'REVIEW_APPROVED',
      message: `Sentiment signal [${id}] approved. Lead score updated for ${review.user_id}.`,
      user_id: adminId,
      metadata: { review_id: id }
    });

    return true;
  },

  /**
   * Bulk Execution: Mass moderation for administrative efficiency.
   */
  massAction: async (ids: string[], action: 'approved' | 'rejected' | 'hidden', adminId: string) => {
    const { error } = await supabase
      .from('reviews')
      .update({ status: action })
      .in('id', ids);

    if (error) throw error;

    await supabase.from('system_logs').insert({
      type: `REVIEW_BULK_${action.toUpperCase()}`,
      message: `Institutional bulk ${action} executed for ${ids.length} signals.`,
      user_id: adminId,
      metadata: { ids }
    });

    return true;
  },

  /**
   * Rejects a sentiment signal (Archival).
   */
  reject: async (id: string, reason: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected', rejection_reason: reason, priority: 0 })
        .eq('id', id);

      if (error) throw error;

      await supabase.from('system_logs').insert({
        type: 'REVIEW_REJECTED',
        message: `Sentiment Signal [${id}] rejected: ${reason}`,
        user_id: adminId,
        severity: 'warning',
        metadata: { review_id: id, reason }
      });

      return true;
    } catch (err) {
      console.warn("Rejection failed:", err);
      return false;
    }
  },

  /**
   * Sets the priority weight for a review.
   */
  setPriority: async (id: string, priority: number) => {
    const { error } = await supabase
      .from('reviews')
      .update({ priority })
      .eq('id', id);
    return !error;
  },

  /**
   * Discovers Reputation Metrics for conversion optimization.
   */
  getReputationIntelligence: async () => {
    const { data } = await supabase.from('reviews').select('rating, status, source, region');
    if (!data) return null;

    const total = data.length;
    const avgRating = data.reduce((acc, r) => acc + r.rating, 0) / total;
    const approvalRate = (data.filter(r => r.status === 'approved').length / total) * 100;

    return {
      avg_rating: avgRating.toFixed(1),
      approval_rate: approvalRate.toFixed(1) + '%',
      total_signals: total
    };
  },

  /**
   * Institutional Acquisition flow with fraud detection.
   */
  submitReview: async (review: Partial<Review>) => {
    const isSpam = await reviewService.detectFraud(review.user_id || '', review.ip_address || '');
    const priority = reviewService.calculatePriority(review.rating || 0, review.source);

    const { error } = await supabase.from('reviews').insert([{
      ...review,
      status: 'pending',
      flagged: isSpam,
      priority,
      created_at: new Date().toISOString()
    }]);

    return !error;
  },

  deleteReview: async (id: string, adminId: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
       await supabase.from('system_logs').insert({
         type: 'REVIEW_DELETED',
         message: `Sentiment Signal [${id}] permanently erased.`,
         user_id: adminId
       });
    }
    return !error;
  }
};
