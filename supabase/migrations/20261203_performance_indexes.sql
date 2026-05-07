-- Migration: Performance Index Optimization for High-Concurrency Marketplace
-- Created: 2026-12-03
-- Purpose: Add composite indexes for query performance, optimize JOIN patterns

-- ============================================================================
-- MARKETPLACE & PRODUCTS
-- ============================================================================

-- Composite index: Filter active products by category (most common marketplace query)
-- Query pattern: SELECT * FROM products WHERE is_active = true AND category = 'algorithm' ORDER BY created_at DESC
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_active_created 
  ON products(category, is_active DESC, created_at DESC)
  WHERE is_active = true;

-- Covering index for product listing with performance metrics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_performance 
  ON products(id) 
  INCLUDE (name, price, image_url, risk_classification)
  WHERE is_active = true;

-- Full-text search index for product names and descriptions
CREATE INDEX CONCAT('idx_products_name_description_fts') 
  ON products USING GIN (
    to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
  );

-- ============================================================================
-- WEBINARS & REGISTRATIONS
-- ============================================================================

-- Composite index: Webinar listing by date + status (upcoming webinars)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webinars_date_status 
  ON webinars(date_time DESC, status);

-- Covering index for webinar count queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webinars_status_created 
  ON webinars(status, created_at DESC);

-- Composite index: Registration lookups (user + webinar)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webinar_registrations_user_webinar 
  ON webinar_registrations(user_id, webinar_id);

-- Registration count aggregation optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webinar_registrations_webinar 
  ON webinar_registrations(webinar_id) 
  INCLUDE (payment_status);

-- ============================================================================
-- USER LICENSES & ENTITLEMENTS
-- ============================================================================

-- Composite index: User active license lookup (dashboard)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_algo_licenses_user_status_active 
  ON algo_licenses(user_id, status) 
  WHERE status = 'active';

-- License key validation (most frequent query - single lookup by key)
-- Already UNIQUE constraint exists, but add covering index for joined data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bot_licenses_key_covering 
  ON bot_licenses(license_key) 
  INCLUDE (algo_id, user_id, status, expires_at, is_active);

-- User entitlements lookup (access control)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_entitlements_user_active 
  ON user_entitlements(user_id, active, expires_at)
  WHERE active = true;

-- ============================================================================
-- PAYMENTS & TRANSACTIONS
-- ============================================================================

-- User payment history queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_user_created 
  ON payments(user_id, created_at DESC);

-- Stripe payment intent lookup (webhook processing)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_stripe_id 
  ON payments(stripe_payment_intent_id) 
  WHERE stripe_payment_intent_id IS NOT NULL;

-- Payment status filtering for admin
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_status_created 
  ON payments(status, created_at DESC);

-- Affiliate payment tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_affiliate_code 
  ON payments(affiliate_code) 
  WHERE affiliate_code IS NOT NULL;

-- ============================================================================
-- CRM & LEADS
-- ============================================================================

-- Lead pipeline: Stage + Score for prioritization query
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_stage_score_created 
  ON leads(stage, score DESC, created_at DESC);

-- Agent workload: Assigned leads by stage
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_assigned_stage 
  ON leads(assigned_to, stage);

-- Lead search: Email lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_email 
  ON leads(email);

-- Affiliate referral tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_referred_by_code 
  ON leads(referred_by_code);

-- ============================================================================
-- COMMISSIONS & SALES TRACKING
-- ============================================================================

-- Agent commission tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_agent_status_created 
  ON commissions(agent_id, status, created_at DESC);

-- Commission pending filter (agent dashboard)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_commissions_pending 
  ON commissions(status, created_at DESC) 
  WHERE status = 'PENDING';

-- Sales tracking: Agent performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_tracking_agent_date 
  ON sales_tracking(agent_id, created_at DESC);

-- ============================================================================
-- CONTENT & BLOG
-- ============================================================================

-- Blog post slug lookup (already exists but ensuring)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_posts_slug_unique 
  ON content_posts(slug) 
  WHERE status = 'published';

-- Content listing by type + status + date
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_posts_type_status_published 
  ON content_posts(content_type, status, published_at DESC)
  WHERE status = 'published';

-- Author content count
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_content_posts_author 
  ON content_posts(author_id, created_at DESC);

-- ============================================================================
-- AFFILIATE & REFFERAL
-- ============================================================================

-- Affiliate code lookup (UNIQUE already exists, this is covering)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_affiliate_codes_user_covering 
  ON affiliate_codes(user_id) 
  INCLUDE (code, total_clicks, total_registrations);

-- Affiliate code by code (for redemption)
CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_codes_code_unique 
  ON affiliate_codes(code);

-- ============================================================================
-- SYSTEM & AUDIT
-- ============================================================================

-- Audit logs: Actor + time for audit trail queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_actor_created 
  ON audit_logs(actor_id, created_at DESC);

-- Audit logs: Entity tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_entity 
  ON audit_logs(entity_type, entity_id, created_at DESC);

-- System logs: Level + time for monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_logs_level_created 
  ON system_logs(level, created_at DESC) 
  WHERE level IN ('error', 'warn', 'critical');

-- ============================================================================
-- PERFORMANCE RESULTS (Time-series data)
-- ============================================================================

-- Latest performance per product (for dashboard)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_results_product_live 
  ON performance_results(product_id, created_at DESC) 
  WHERE is_live = true;

-- Historical performance for charting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_results_product_period 
  ON performance_results(product_id, period_start, period_end);

-- ============================================================================
-- PRODUCT VARIANTS & IMAGES
-- ============================================================================

-- Variant lookup by product
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_variants_product 
  ON product_variants(product_id);

-- Primary image lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_images_primary 
  ON product_images(product_id) 
  WHERE is_primary = true;

-- ============================================================================
-- JSONB & ARRAY INDEXING (for metadata queries)
-- ============================================================================

-- GIN index for reviews JSONB metadata (if used for filtering)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_metadata_gin 
  ON reviews USING GIN (metadata);

-- GIN index for product performance_data JSONB
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_performance_data_gin 
  ON products USING GIN (performance_data);

-- GIN index for leads CRM metadata (tag queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS EXISTS idx_leads_crm_metadata_gin 
  ON leads USING GIN (crm_metadata);

-- ============================================================================
-- PARTIAL INDEXES FOR COMMON FILTERS
-- ============================================================================

-- Active products only (most queries filter is_active = true)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active 
  ON products(created_at DESC) 
  WHERE is_active = true;

-- Active webinar listings
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webinars_upcoming 
  ON webinars(date_time) 
  WHERE status = 'upcoming';

-- ============================================================================
-- VACUUM ANALYZE for statistics update
-- ============================================================================
-- Run after index creation for query planner optimization
-- (Handled by Supabase auto-vacuum, but can be triggered manually)
ANALYZE;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON INDEX idx_products_category_active_created IS 
  'Optimizes marketplace category filtering with active status';
COMMENT ON INDEX idx_webinar_registrations_user_webinar IS 
  'Fast lookup for existing registration checks during signup';
COMMENT ON INDEX idx_algo_licenses_user_status_active IS 
  'Dashboard license validation query';
COMMENT ON INDEX idx_payments_user_created IS 
  'User payment history page';
COMMENT ON INDEX idx_leads_stage_score_created IS 
  'CRM lead prioritization query';
COMMENT ON INDEX idx_commissions_agent_status_created IS 
  'Agent commission dashboard';
