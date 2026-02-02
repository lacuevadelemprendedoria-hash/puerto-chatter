-- Create a function to atomically increment analytics counters
CREATE OR REPLACE FUNCTION public.increment_analytics_counter(
  target_date DATE,
  counter_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to insert a new row, if it exists, update the counter atomically
  INSERT INTO analytics_daily (date, opens_count, unique_visitors_count, sessions_count, questions_count, emails_count)
  VALUES (
    target_date,
    CASE WHEN counter_name = 'opens_count' THEN 1 ELSE 0 END,
    CASE WHEN counter_name = 'unique_visitors_count' THEN 1 ELSE 0 END,
    CASE WHEN counter_name = 'sessions_count' THEN 1 ELSE 0 END,
    CASE WHEN counter_name = 'questions_count' THEN 1 ELSE 0 END,
    CASE WHEN counter_name = 'emails_count' THEN 1 ELSE 0 END
  )
  ON CONFLICT (date) DO UPDATE SET
    opens_count = analytics_daily.opens_count + CASE WHEN counter_name = 'opens_count' THEN 1 ELSE 0 END,
    unique_visitors_count = analytics_daily.unique_visitors_count + CASE WHEN counter_name = 'unique_visitors_count' THEN 1 ELSE 0 END,
    sessions_count = analytics_daily.sessions_count + CASE WHEN counter_name = 'sessions_count' THEN 1 ELSE 0 END,
    questions_count = analytics_daily.questions_count + CASE WHEN counter_name = 'questions_count' THEN 1 ELSE 0 END,
    emails_count = analytics_daily.emails_count + CASE WHEN counter_name = 'emails_count' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$;