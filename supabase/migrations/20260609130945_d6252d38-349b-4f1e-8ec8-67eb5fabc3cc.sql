
-- 1) Lock down analytics_visitors: remove public INSERT, route through SECURITY DEFINER
DROP POLICY IF EXISTS "Anyone can insert analytics_visitors" ON public.analytics_visitors;
REVOKE INSERT ON public.analytics_visitors FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.track_visitor(_visitor_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _visitor_id IS NULL OR length(_visitor_id) = 0 OR length(_visitor_id) > 128 THEN
    RETURN;
  END IF;
  INSERT INTO public.analytics_visitors (visitor_id, visited_at)
  VALUES (_visitor_id, now())
  ON CONFLICT DO NOTHING;
END;
$$;

-- 2) Restrict hostel_config public read to a whitelist of non-sensitive keys
DROP POLICY IF EXISTS "Anyone can read hostel_config" ON public.hostel_config;

CREATE POLICY "Public can read whitelisted hostel_config keys"
ON public.hostel_config FOR SELECT
USING (key IN (
  'hostel_name',
  'hostel_city',
  'hostel_island',
  'event_today_en',
  'event_today_es',
  'reception_phone',
  'whatsapp'
));

CREATE POLICY "Admins can read all hostel_config"
ON public.hostel_config FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));
