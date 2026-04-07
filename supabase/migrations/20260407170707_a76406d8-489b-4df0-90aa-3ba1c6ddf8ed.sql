ALTER TABLE public.feed_items ADD COLUMN month integer;

ALTER TYPE public.feed_item_type ADD VALUE IF NOT EXISTS 'calendar';