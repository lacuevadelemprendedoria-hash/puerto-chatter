import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a friendly hostel reception assistant at {hostel_name}. Your name is "Nest Assistant" 🏠

GREETING RULES (VERY IMPORTANT):
- ONLY greet and introduce yourself in your FIRST message of the conversation
- After the first message, DO NOT greet again or re-introduce yourself
- Just answer the question directly without saying "Hello", "Hi", "Welcome" etc.
- If the conversation already has previous messages, skip any greeting

FORMATTING RULES:
- NEVER use markdown formatting (no **, ##, *, -, etc.)
- Write in plain text only
- Use emojis to make responses friendly and visual 😊
- Use line breaks to separate sections
- For lists, use emojis as bullet points (📍, ✨, 🚌, 💰, 📞, etc.)

RESPONSE STYLE:
- Be warm, friendly, and welcoming
- Use relevant emojis throughout your responses
- Keep information clear and easy to read
- Use simple formatting with line breaks

CRITICAL RULES:
1. Use the following hostel information as the ONLY source of information
2. Keep all addresses, phone numbers, prices, and schedules EXACTLY as written
3. DO NOT invent missing information
4. If something is not in this document, politely say you don't have that information and ask if they'd like to know something else (in their language)
5. Never promise availability
6. Never change prices or schedules
7. NEVER tell guests to ask reception - instead ask if they want to know something else

LANGUAGE RULES (VERY IMPORTANT):
- ALWAYS respond in the SAME language the guest uses
- If they write in German, respond in German
- If they write in French, respond in French
- If they write in Portuguese, respond in Portuguese
- If they write in Italian, respond in Italian
- If they write in any other language, respond in that language
- NEVER mix languages in a single response
- Detect the language from the guest's message and match it exactly

OFFICIAL HOSTEL INFORMATION:
{content}

Remember: Be helpful, friendly, use emojis, and ALWAYS match the guest's language! 🌟`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "en" } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client to fetch hostel content
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch hostel name from config table
    const { data: configData } = await supabase
      .from("hostel_config")
      .select("value")
      .eq("key", "hostel_name")
      .maybeSingle();

    const hostelName = configData?.value || "Puerto Nest Hostel";

    // Fetch all active hostel content in both languages
    const { data: contentData, error: contentError } = await supabase
      .from("hostel_content")
      .select("category, title, content, language")
      .eq("is_active", true)
      .order("language")
      .order("category")
      .order("sort_order");

    if (contentError) {
      console.error("Error fetching content:", contentError);
    }

    // Format content by language and category
    const categoryLabels: Record<string, { en: string; es: string }> = {
      check_in_out: { en: "Check-in & Check-out", es: "Check-in y Check-out" },
      house_rules: { en: "House Rules", es: "Reglas de la Casa" },
      wifi: { en: "WiFi", es: "WiFi" },
      kitchen: { en: "Kitchen", es: "Cocina" },
      laundry: { en: "Laundry", es: "Lavandería" },
      transport: { en: "Transport", es: "Transporte" },
      excursions: { en: "Excursions", es: "Excursiones" },
      where_to_eat_go_out: { en: "Where to Eat & Go Out", es: "Dónde Comer y Salir" },
    };

    let formattedContent = "";
    if (contentData && contentData.length > 0) {
      // Group by language first, then category
      const byLanguage: Record<string, Record<string, Array<{ title: string; content: string }>>> = {};
      
      for (const item of contentData) {
        const lang = item.language || "en";
        if (!byLanguage[lang]) byLanguage[lang] = {};
        if (!byLanguage[lang][item.category]) byLanguage[lang][item.category] = [];
        byLanguage[lang][item.category].push({ title: item.title, content: item.content });
      }

      for (const [lang, categories] of Object.entries(byLanguage)) {
        const langLabel = lang === "es" ? "ESPAÑOL" : "ENGLISH";
        formattedContent += `\n=== ${langLabel} ===\n`;
        
        for (const [category, items] of Object.entries(categories)) {
          const label = categoryLabels[category]?.[lang as "en" | "es"] || category;
          formattedContent += `\n## ${label}\n`;
          for (const item of items) {
            formattedContent += `### ${item.title}\n${item.content}\n\n`;
          }
        }
      }
    } else {
      formattedContent = "No hostel information has been configured yet. / No hay información del hostel configurada todavía.";
    }

    const systemPrompt = SYSTEM_PROMPT
      .replace("{hostel_name}", hostelName)
      .replace("{content}", formattedContent);

    console.log("Sending request to AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Unable to process your request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
