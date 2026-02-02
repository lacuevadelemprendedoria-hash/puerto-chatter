import { useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_ID_KEY = "pn_visitor_id";
const SESSION_ID_KEY = "pn_session_id";
const SESSION_ACTIVITY_KEY = "pn_session_activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Keys for tracking (use sessionStorage to survive StrictMode remounts)
const TRACKED_OPEN_KEY = "pn_tracked_open";
const TRACKED_VISITOR_KEY = "pn_tracked_visitor";
const TRACKED_SESSION_KEY = "pn_tracked_session";

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
  // Increment a counter in analytics_daily using atomic database function
  const incrementCounter = useCallback(async (eventType: EventType) => {
    const today = getTodayDate();
    const columnName = `${eventType}_count`;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.rpc as any)('increment_analytics_counter', {
        target_date: today,
        counter_name: columnName
      });

      if (error) {
        console.debug("Analytics increment error:", error);
      }
    } catch (error) {
      console.debug("Analytics error:", error);
    }
  }, []);

  // Check if visitor is new and track
  const checkAndTrackNewVisitor = useCallback(async (visitorId: string) => {
    try {
      const { error } = await supabase
        .from("analytics_visitors")
        .insert({ visitor_id: visitorId });

      if (!error) {
        await incrementCounter("unique_visitors");
      } else if (error.code !== '23505') {
        console.debug("Analytics visitor check error:", error);
      }
    } catch (error) {
      console.debug("Analytics visitor check error:", error);
    }
  }, [incrementCounter]);

  // Track app open (called once per page load, survives StrictMode)
  const trackAppOpen = useCallback(async () => {
    // Use sessionStorage to survive React StrictMode remounts
    const pageLoadId = performance.timeOrigin.toString();
    const trackedKey = `${TRACKED_OPEN_KEY}_${pageLoadId}`;
    
    if (sessionStorage.getItem(trackedKey)) return;
    sessionStorage.setItem(trackedKey, "true");

    const visitorId = getOrCreateVisitorId();
    const { isNew: isNewSession } = getOrCreateSessionId();

    // Track app open
    await incrementCounter("opens");

    // Track unique visitor
    const visitorTrackedKey = `${TRACKED_VISITOR_KEY}_${pageLoadId}`;
    if (!sessionStorage.getItem(visitorTrackedKey)) {
      sessionStorage.setItem(visitorTrackedKey, "true");
      await checkAndTrackNewVisitor(visitorId);
    }

    // Track session start
    const sessionTrackedKey = `${TRACKED_SESSION_KEY}_${pageLoadId}`;
    if (isNewSession && !sessionStorage.getItem(sessionTrackedKey)) {
      sessionStorage.setItem(sessionTrackedKey, "true");
      await incrementCounter("sessions");
    }
  }, [incrementCounter, checkAndTrackNewVisitor]);

  // Track question sent
  const trackQuestionSent = useCallback(async () => {
    updateActivity();
    await incrementCounter("questions");
  }, [incrementCounter]);

  // Track email submitted
  const trackEmailSubmitted = useCallback(async () => {
    updateActivity();
    await incrementCounter("emails");
  }, [incrementCounter]);

  // Track user activity
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
