-- Migration: Add custom commission rate column to affiliate_codes
-- Idempotent script for Supabase migrations runner

ALTER TABLE affiliate_codes ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 10.00;
