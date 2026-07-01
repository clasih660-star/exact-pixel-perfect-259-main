-- Billing writes must go through trusted server functions or platform admins.
-- Institution owners/admins can read billing state, but must not be able to
-- directly mark payments or subscriptions as successful from the browser.

DROP POLICY IF EXISTS "billing_customers manage institution staff" ON public.billing_customers;
DROP POLICY IF EXISTS "institution_subscriptions manage institution staff" ON public.institution_subscriptions;
DROP POLICY IF EXISTS "payment_transactions manage institution staff" ON public.payment_transactions;

DROP POLICY IF EXISTS "billing_customers manage platform admins" ON public.billing_customers;
CREATE POLICY "billing_customers manage platform admins" ON public.billing_customers
  FOR ALL TO authenticated
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

DROP POLICY IF EXISTS "institution_subscriptions manage platform admins" ON public.institution_subscriptions;
CREATE POLICY "institution_subscriptions manage platform admins" ON public.institution_subscriptions
  FOR ALL TO authenticated
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

DROP POLICY IF EXISTS "payment_transactions manage platform admins" ON public.payment_transactions;
CREATE POLICY "payment_transactions manage platform admins" ON public.payment_transactions
  FOR ALL TO authenticated
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));
