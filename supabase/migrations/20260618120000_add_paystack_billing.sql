CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  amount_minor integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  interval text NOT NULL DEFAULT 'month' CHECK (interval IN ('month', 'year', 'one_time')),
  highlight boolean NOT NULL DEFAULT false,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.billing_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  email text,
  plan_slug text,
  preferred_currency text NOT NULL DEFAULT 'NGN',
  provider text NOT NULL DEFAULT 'paystack',
  provider_customer_code text,
  last_reference text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT billing_customers_unique_institution UNIQUE (institution_id)
);

CREATE TABLE IF NOT EXISTS public.institution_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'paused', 'canceled', 'expired')),
  billing_source text NOT NULL DEFAULT 'manual' CHECK (billing_source IN ('manual', 'paystack', 'invoice')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  reference text,
  provider_reference text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.institution_subscriptions(id) ON DELETE SET NULL,
  reference text NOT NULL,
  provider_reference text,
  channel text,
  amount_minor integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'initialized' CHECK (status IN ('initialized', 'pending', 'success', 'failed', 'abandoned')),
  customer_email text,
  paid_at timestamptz,
  raw_response jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payment_transactions_unique_reference UNIQUE (reference)
);

CREATE INDEX IF NOT EXISTS idx_billing_customers_institution ON public.billing_customers(institution_id);
CREATE INDEX IF NOT EXISTS idx_institution_subscriptions_institution ON public.institution_subscriptions(institution_id);
CREATE INDEX IF NOT EXISTS idx_institution_subscriptions_status ON public.institution_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON public.payment_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_institution ON public.payment_transactions(institution_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscription_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.institution_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_transactions TO authenticated;

GRANT ALL ON public.subscription_plans TO service_role;
GRANT ALL ON public.billing_customers TO service_role;
GRANT ALL ON public.institution_subscriptions TO service_role;
GRANT ALL ON public.payment_transactions TO service_role;

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_platform_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'platform_admin'
  );
$$;

DROP POLICY IF EXISTS "subscription_plans read authenticated" ON public.subscription_plans;
CREATE POLICY "subscription_plans read authenticated" ON public.subscription_plans FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "subscription_plans manage platform admins" ON public.subscription_plans;
CREATE POLICY "subscription_plans manage platform admins" ON public.subscription_plans FOR ALL TO authenticated
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

DROP POLICY IF EXISTS "billing_customers read institution staff" ON public.billing_customers;
CREATE POLICY "billing_customers read institution staff" ON public.billing_customers FOR SELECT TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]));

DROP POLICY IF EXISTS "billing_customers manage institution staff" ON public.billing_customers;
CREATE POLICY "billing_customers manage institution staff" ON public.billing_customers FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]));

DROP POLICY IF EXISTS "institution_subscriptions read institution staff" ON public.institution_subscriptions;
CREATE POLICY "institution_subscriptions read institution staff" ON public.institution_subscriptions FOR SELECT TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]));

DROP POLICY IF EXISTS "institution_subscriptions manage institution staff" ON public.institution_subscriptions;
CREATE POLICY "institution_subscriptions manage institution staff" ON public.institution_subscriptions FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]));

DROP POLICY IF EXISTS "institution_subscriptions read platform admins" ON public.institution_subscriptions;
CREATE POLICY "institution_subscriptions read platform admins" ON public.institution_subscriptions FOR SELECT TO authenticated
  USING (public.is_platform_admin(auth.uid()));

DROP POLICY IF EXISTS "payment_transactions read institution staff" ON public.payment_transactions;
CREATE POLICY "payment_transactions read institution staff" ON public.payment_transactions FOR SELECT TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]));

DROP POLICY IF EXISTS "payment_transactions manage institution staff" ON public.payment_transactions;
CREATE POLICY "payment_transactions manage institution staff" ON public.payment_transactions FOR ALL TO authenticated
  USING (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]))
  WITH CHECK (public.has_institution_role(institution_id, auth.uid(), ARRAY['owner', 'admin']::public.member_role[]));

DROP POLICY IF EXISTS "payment_transactions read platform admins" ON public.payment_transactions;
CREATE POLICY "payment_transactions read platform admins" ON public.payment_transactions FOR SELECT TO authenticated
  USING (public.is_platform_admin(auth.uid()));

DROP TRIGGER IF EXISTS subscription_plans_updated ON public.subscription_plans;
CREATE TRIGGER subscription_plans_updated BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS billing_customers_updated ON public.billing_customers;
CREATE TRIGGER billing_customers_updated BEFORE UPDATE ON public.billing_customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS institution_subscriptions_updated ON public.institution_subscriptions;
CREATE TRIGGER institution_subscriptions_updated BEFORE UPDATE ON public.institution_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS payment_transactions_updated ON public.payment_transactions;
CREATE TRIGGER payment_transactions_updated BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.subscription_plans (slug, name, description, amount_minor, currency, interval, highlight, features)
VALUES
  (
    'starter',
    'Starter',
    'Explore Klassruum basics for new institutions getting started.',
    0,
    'NGN',
    'month',
    false,
    '["Core dashboard access", "Basic course setup", "Community support"]'::jsonb
  ),
  (
    'pro',
    'Pro',
    'Launch production-ready AI classrooms with billing and reporting.',
    1950000,
    'NGN',
    'month',
    true,
    '["Everything in Starter", "Priority onboarding", "Advanced reporting", "Billing history"]'::jsonb
  ),
  (
    'enterprise',
    'Enterprise',
    'Custom governance, support, and rollout plans for large institutions.',
    5750000,
    'NGN',
    'month',
    false,
    '["Everything in Pro", "Tailored onboarding", "Dedicated support", "Custom governance"]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  amount_minor = EXCLUDED.amount_minor,
  currency = EXCLUDED.currency,
  interval = EXCLUDED.interval,
  highlight = EXCLUDED.highlight,
  features = EXCLUDED.features,
  status = 'active';
