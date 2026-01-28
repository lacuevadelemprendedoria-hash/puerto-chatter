-- Create enum for content categories
CREATE TYPE public.content_category AS ENUM (
  'check_in_out',
  'house_rules',
  'wifi',
  'kitchen',
  'laundry',
  'transport',
  'excursions',
  'where_to_eat_go_out'
);

-- Create enum for supported languages
CREATE TYPE public.supported_language AS ENUM ('en', 'es');

-- Create hostel_content table for storing all information
CREATE TABLE public.hostel_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category content_category NOT NULL,
  language supported_language NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category, language, title)
);

-- Create admin_users table (separate from auth for role management)
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_sessions table to track conversations
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  language supported_language DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hostel_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = _user_id
  )
$$;

-- RLS Policies for hostel_content
-- Anyone can read active content (for guest chat)
CREATE POLICY "Anyone can read active content"
ON public.hostel_content
FOR SELECT
USING (is_active = true);

-- Admins can do everything with content
CREATE POLICY "Admins can insert content"
ON public.hostel_content
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update content"
ON public.hostel_content
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete content"
ON public.hostel_content
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS for admin_users - only admins can see admin list
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS for chat_sessions - public insert, read own session
CREATE POLICY "Anyone can create chat sessions"
ON public.chat_sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read chat sessions"
ON public.chat_sessions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update chat sessions"
ON public.chat_sessions
FOR UPDATE
USING (true);

-- RLS for chat_messages - public insert and read
CREATE POLICY "Anyone can create chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read chat messages"
ON public.chat_messages
FOR SELECT
USING (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_hostel_content_updated_at
BEFORE UPDATE ON public.hostel_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();