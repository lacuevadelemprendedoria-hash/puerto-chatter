import { useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_ID_KEY = "pn_visitor_id";
const SESSION_ID_KEY = "pn_session_id";
const SESSION_ACTIVITY_KEY = "pn_session_activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Generate or retrieve visitor ID (persists across visits)
function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

// Generate or retrieve session ID (expires after inactivity)
function getOrCreateSessionId(): { sessionId: string; isNew: boolean } {
  const lastActivity = sessionStorage.getItem(SESSION_ACTIVITY_KEY);
  const now = Date.now();

  // Check if session expired
  if (lastActivity && now - parseInt(lastActivity, 10) > SESSION_TIMEOUT_MS) {
    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(SESSION_ACTIVITY_KEY);
  }

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const isNew = !sessionId;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  // Update activity timestamp
  sessionStorage.setItem(SESSION_ACTIVITY_KEY, now.toString());

  return { sessionId, isNew };
}

// Reset activity timer
function updateActivity(): void {
  sessionStorage.setItem(SESSION_ACTIVITY_KEY, Date.now().toString());
}

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

type EventType = "opens" | "unique_visitors" | "sessions" | "questions" | "emails";

export function useAnalytics() {
  const hasTrackedOpen = useRef(false);
  const hasTrackedVisitor = useRef(false);
  const hasTrackedSession = useRef(false);

  // Increment a counter in analytics_daily
  const incrementCounter = useCallback(async (eventType: EventType) => {
    const today = getTodayDate();
    const columnName = `${eventType}_count`;

    try {
      // Try to get existing row for today
      const { data: existing, error } = await supabase
        .from("analytics_daily")
        .select("*")
        .eq("date", today)
        .maybeSingle();

      if (existing && !error) {
        // Increment existing counter
        const currentValue = (existing as Record<string, unknown>)[columnName] as number || 0;
        await supabase
          .from("analytics_daily")
          .update({ [columnName]: currentValue + 1 })
          .eq("id", existing.id);
      } else if (!error) {
        // Create new row for today
        await supabase
          .from("analytics_daily")
          .insert({ date: today, [columnName]: 1 });
      }
    } catch (error) {
      // Silent fail - analytics should never break the app
      console.debug("Analytics error:", error);
    }
  }, []);

  // Check if visitor is new (first time seeing this visitor_id)
  const checkAndTrackNewVisitor = useCallback(async (visitorId: string) => {
    try {
      const { data: existing, error } = await supabase
        .from("analytics_visitors")
        .select("id")
        .eq("visitor_id", visitorId)
        .maybeSingle();

      if (!existing && !error) {
        // New visitor - record and increment counter
        await supabase
          .from("analytics_visitors")
          .insert({ visitor_id: visitorId });
        await incrementCounter("unique_visitors");
      }
    } catch (error) {
      console.debug("Analytics visitor check error:", error);
    }
  }, [incrementCounter]);

  // Track app open (called once per page load)
  const trackAppOpen = useCallback(async () => {
    if (hasTrackedOpen.current) return;
    hasTrackedOpen.current = true;

    const visitorId = getOrCreateVisitorId();
    const { isNew: isNewSession } = getOrCreateSessionId();

    // Track app open
    await incrementCounter("opens");

    // Track unique visitor (only if not tracked this session)
    if (!hasTrackedVisitor.current) {
      hasTrackedVisitor.current = true;
      await checkAndTrackNewVisitor(visitorId);
    }

    // Track session start
    if (isNewSession && !hasTrackedSession.current) {
      hasTrackedSession.current = true;
      await incrementCounter("sessions");
    }
  }, [incrementCounter, checkAndTrackNewVisitor]);

  // Track question sent (no content stored, just count)
  const trackQuestionSent = useCallback(async () => {
    updateActivity();
    await incrementCounter("questions");
  }, [incrementCounter]);

  // Track email submitted
  const trackEmailSubmitted = useCallback(async () => {
    updateActivity();
    await incrementCounter("emails");
  }, [incrementCounter]);

  // Track user activity (resets session timeout)
  const trackActivity = useCallback(() => {
    updateActivity();
  }, []);

  // Auto-track on mount
  useEffect(() => {
    trackAppOpen();
  }, [trackAppOpen]);

  return {
    trackQuestionSent,
    trackEmailSubmitted,
    trackActivity,
  };
}
