-- Analytics daily aggregated table (no PII stored)
CREATE TABLE public.analytics_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  opens_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors_count INTEGER NOT NULL DEFAULT 0,
  sessions_count INTEGER NOT NULL DEFAULT 0,
  questions_count INTEGER NOT NULL DEFAULT 0,
  emails_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track visitor_ids to detect unique visitors (only stores anonymous UUIDs)
CREATE TABLE public.analytics_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL UNIQUE,
  first_seen_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_visitors ENABLE ROW LEVEL SECURITY;

-- Public read for analytics (admin dashboard)
CREATE POLICY "Admins can read analytics_daily" 
ON public.analytics_daily 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Anyone can insert (for tracking)
CREATE POLICY "Anyone can insert analytics_daily" 
ON public.analytics_daily 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update (for incrementing counters)
CREATE POLICY "Anyone can update analytics_daily" 
ON public.analytics_daily 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can read analytics_visitors" 
ON public.analytics_visitors 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can insert analytics_visitors" 
ON public.analytics_visitors 
FOR INSERT 
WITH CHECK (true);

-- Index for fast date lookups
CREATE INDEX idx_analytics_daily_date ON public.analytics_daily(date);
CREATE INDEX idx_analytics_visitors_visitor_id ON public.analytics_visitors(visitor_id);

-- Trigger for updated_at
CREATE TRIGGER update_analytics_daily_updated_at
BEFORE UPDATE ON public.analytics_daily
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();