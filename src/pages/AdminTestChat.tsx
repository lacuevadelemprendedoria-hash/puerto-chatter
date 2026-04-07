import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Copy, Loader2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const TEST_QUESTIONS = [
  "What is the WiFi password and network name?",
  "What time is check-in and check-out?",
  "How much is a towel rental?",
  "How does laundry work and what does it cost?",
  "Is there parking near the hostel?",
  "Where can I store my luggage?",
  "What are the house rules?",
  "How do I get to Loro Parque from the hostel?",
  "How much does Loro Parque cost?",
  "Tell me about the Jardín Botánico — price, hours and how to get there",
  "How do I get to Teide by bus from the hostel?",
  "How much does the Teide cable car cost?",
  "What is Masca and how do I get there?",
  "Where can I swim for free near the hostel?",
  "What is Lago Martiánez and how much does it cost?",
  "How do I get to the airport from the hostel?",
  "Is there a taxi number I can call?",
  "Where is the nearest pharmacy and what are the hours?",
  "Where is the nearest hospital?",
  "I lost my key — what do I do?",
  "Where is the nearest supermarket?",
  "Where can I get cash / find an ATM?",
  "What activities does the hostel organise?",
  "Can I borrow snorkel masks?",
  "What is the Nest Pass?",
];

const FAIL_PHRASES = [
  "don't have information", "no tengo información", "not in my",
  "i don't know", "no sé", "cannot find",
];

type Status = "ok" | "short" | "fail";

interface TestResult {
  index: number;
  question: string;
  response: string;
  status: Status;
}

function getStatus(response: string): Status {
  const lower = response.toLowerCase();
  for (const phrase of FAIL_PHRASES) {
    if (lower.includes(phrase)) return "fail";
  }
  if (response.length < 100) return "short";
  return "ok";
}

async function sendQuestion(question: string): Promise<string> {
  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: question }],
      language: "en",
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No stream");

  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) full += content;
      } catch { /* skip */ }
    }
  }

  return full;
}

const statusConfig = {
  ok: { label: "OK", icon: CheckCircle, color: "bg-green-100 text-green-800 border-green-300" },
  short: { label: "SHORT", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  fail: { label: "FAIL", icon: XCircle, color: "bg-red-100 text-red-800 border-red-300" },
};

const statusOrder: Record<Status, number> = { fail: 0, short: 1, ok: 2 };

export default function AdminTestChat() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const abortRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/admin"); return; }
      supabase.rpc("is_admin", { _user_id: session.user.id }).then(({ data }) => {
        if (!data) { navigate("/admin"); return; }
        setIsAdmin(true);
        setLoading(false);
      });
    });
  }, [navigate]);

  const runTests = async () => {
    setRunning(true);
    setResults([]);
    setCurrent(0);
    abortRef.current = false;

    const newResults: TestResult[] = [];
    for (let i = 0; i < TEST_QUESTIONS.length; i++) {
      if (abortRef.current) break;
      setCurrent(i + 1);
      const question = TEST_QUESTIONS[i];
      try {
        const response = await sendQuestion(question);
        newResults.push({ index: i + 1, question, response, status: getStatus(response) });
      } catch (err) {
        newResults.push({ index: i + 1, question, response: `Error: ${err}`, status: "fail" });
      }
      setResults([...newResults]);
    }
    setRunning(false);
  };

  const copyReport = () => {
    const sorted = [...results].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    const summary = {
      ok: results.filter(r => r.status === "ok").length,
      short: results.filter(r => r.status === "short").length,
      fail: results.filter(r => r.status === "fail").length,
    };
    let text = `Chat Test Report — ${new Date().toLocaleString()}\n`;
    text += `Summary: ${summary.ok} OK / ${summary.short} SHORT / ${summary.fail} FAIL\n\n`;
    for (const r of sorted) {
      text += `[${r.status.toUpperCase()}] Q${r.index}: ${r.question}\n${r.response}\n\n`;
    }
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied to clipboard" });
  };

  const sorted = [...results].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  const summary = {
    ok: results.filter(r => r.status === "ok").length,
    short: results.filter(r => r.status === "short").length,
    fail: results.filter(r => r.status === "fail").length,
  };

  if (loading || !isAdmin) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Chat Test Suite</h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={runTests} disabled={running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {running ? `Testing ${current} of ${TEST_QUESTIONS.length}...` : "Run Tests"}
          </Button>
          {results.length > 0 && (
            <Button variant="outline" onClick={copyReport}>
              <Copy className="h-4 w-4 mr-2" /> Copy Report
            </Button>
          )}
        </div>

        {/* Progress */}
        {running && (
          <div className="space-y-2">
            <Progress value={(current / TEST_QUESTIONS.length) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground">Testing {current} of {TEST_QUESTIONS.length}...</p>
          </div>
        )}

        {/* Summary */}
        {results.length > 0 && !running && (
          <div className="flex gap-3">
            <Badge className="bg-green-100 text-green-800 border-green-300 text-sm px-3 py-1">🟢 {summary.ok} OK</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-sm px-3 py-1">🟡 {summary.short} SHORT</Badge>
            <Badge className="bg-red-100 text-red-800 border-red-300 text-sm px-3 py-1">🔴 {summary.fail} FAIL</Badge>
          </div>
        )}

        {/* Results */}
        <div className="space-y-3">
          {sorted.map((r) => {
            const cfg = statusConfig[r.status];
            const Icon = cfg.icon;
            return (
              <Card key={r.index} className="overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">
                      <span className="text-muted-foreground mr-1">Q{r.index}.</span>
                      {r.question}
                    </p>
                    <Badge className={`${cfg.color} shrink-0 flex items-center gap-1`}>
                      <Icon className="h-3 w-3" /> {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{r.response}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
