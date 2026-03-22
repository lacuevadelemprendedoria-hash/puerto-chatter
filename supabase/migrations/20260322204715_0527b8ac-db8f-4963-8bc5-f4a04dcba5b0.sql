
-- hostel_config: key-value store for per-hostel settings
CREATE TABLE IF NOT EXISTS public.hostel_config (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT NOT NULL,
  label       TEXT,
  description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hostel_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hostel_config"
ON public.hostel_config FOR SELECT USING (true);

CREATE POLICY "Admins can insert hostel_config"
ON public.hostel_config FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update hostel_config"
ON public.hostel_config FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete hostel_config"
ON public.hostel_config FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_hostel_config_updated_at
BEFORE UPDATE ON public.hostel_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default config values
INSERT INTO public.hostel_config (key, value, label, description) VALUES
  ('hostel_name',      'Puerto Nest Hostel',       'Hostel Name',       'Full name shown to guests and in the AI assistant'),
  ('hostel_city',      'Puerto de la Cruz',         'City',              'City where the hostel is located'),
  ('hostel_island',    'Tenerife',                  'Island / Region',   'Island or region'),
  ('reception_phone',  '+34 XXX XXX XXX',           'Reception Phone',   'Phone number shown in help flows'),
  ('whatsapp',         '+34 XXX XXX XXX',           'WhatsApp',          'WhatsApp number for guest contact'),
  ('event_today_en',   'Today at the Hostel 🏠',    'Event Today (EN)',  'Short event label shown in the status bar (English)'),
  ('event_today_es',   'Hoy en el Hostel 🏠',       'Evento Hoy (ES)',   'Etiqueta corta del evento en la barra de estado (Español)')
ON CONFLICT (key) DO NOTHING;
