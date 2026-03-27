-- ============================================================
-- MinesMinis Subscription System — Database Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add subscription fields to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS iyzico_subscription_ref text;

-- Index for quick subscription lookups
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan
  ON public.users (subscription_plan);

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer
  ON public.users (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_iyzico_ref
  ON public.users (iyzico_subscription_ref)
  WHERE iyzico_subscription_ref IS NOT NULL;

-- Add a check constraint for valid plan values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_subscription_plan_check'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_subscription_plan_check
      CHECK (subscription_plan IN ('free', 'premium', 'family', 'classroom'));
  END IF;
END $$;

-- Add a check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_subscription_status_check'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_subscription_status_check
      CHECK (subscription_status IN ('active', 'trialing', 'canceled', 'past_due', 'expired', 'none'));
  END IF;
END $$;

-- RLS policy: users can read their own subscription data
-- (Assumes existing RLS policies allow users to read their own row)

COMMENT ON COLUMN public.users.subscription_plan IS 'Current subscription plan: free, premium, family, classroom';
COMMENT ON COLUMN public.users.subscription_status IS 'Subscription status: active, trialing, canceled, past_due, expired, none';
COMMENT ON COLUMN public.users.subscription_expires_at IS 'When the current subscription period ends';
COMMENT ON COLUMN public.users.stripe_customer_id IS 'Stripe customer ID for international payments';
COMMENT ON COLUMN public.users.iyzico_subscription_ref IS 'Iyzico payment reference for Turkish payments';
