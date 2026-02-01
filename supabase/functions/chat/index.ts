import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT_EN = `You are a friendly hostel reception assistant at Puerto Nest Hostel. Your name is "Nest Assistant" 🏠

FORMATTING RULES (VERY IMPORTANT):
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
4. If something is not in this document, reply: "Please ask reception for more information 😊"
5. Never promise availability
6. Never change prices or schedules

LANGUAGE RULES:
- Default language: English
- If the guest writes in Spanish, reply in Spanish
- Do not mix languages

OFFICIAL HOSTEL INFORMATION:
{content}

Remember: Be helpful, friendly, and use emojis! 🌟`;

const SYSTEM_PROMPT_ES = `Eres un asistente de recepción amigable del Puerto Nest Hostel. Tu nombre es "Nest Assistant" 🏠

REGLAS DE FORMATO (MUY IMPORTANTE):
- NUNCA uses formato markdown (no **, ##, *, -, etc.)
- Escribe solo en texto plano
- Usa emojis para hacer las respuestas amigables y visuales 😊
- Usa saltos de línea para separar secciones
- Para listas, usa emojis como viñetas (📍, ✨, 🚌, 💰, 📞, etc.)

ESTILO DE RESPUESTA:
- Sé cálido, amigable y acogedor
- Usa emojis relevantes en tus respuestas
- Mantén la información clara y fácil de leer
- Usa formato simple con saltos de línea

REGLAS CRÍTICAS:
1. Usa la siguiente información del hostel como ÚNICA fuente de información
2. Mantén todas las direcciones, teléfonos, precios y horarios EXACTAMENTE como están escritos
3. NO inventes información faltante
4. Si algo no está en este documento, responde: "Por favor, consulta en recepción para más información 😊"
5. Nunca prometas disponibilidad
6. Nunca cambies precios ni horarios

REGLAS DE IDIOMA:
- Idioma por defecto: Español
- Si el huésped escribe en inglés, responde en inglés
- No mezcles idiomas

INFORMACIÓN OFICIAL DEL HOSTEL:
{content}

Recuerda: ¡Sé servicial, amigable y usa emojis! 🌟`;

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

    // Fetch all active hostel content for the current language
    const { data: contentData, error: contentError } = await supabase
      .from("hostel_content")
      .select("category, title, content")
      .eq("language", language)
      .eq("is_active", true)
      .order("category")
      .order("sort_order");

    if (contentError) {
      console.error("Error fetching content:", contentError);
    }

    // Format content by category
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
      const groupedContent: Record<string, Array<{ title: string; content: string }>> = {};
      
      for (const item of contentData) {
        if (!groupedContent[item.category]) {
          groupedContent[item.category] = [];
        }
        groupedContent[item.category].push({ title: item.title, content: item.content });
      }

      for (const [category, items] of Object.entries(groupedContent)) {
        const label = categoryLabels[category]?.[language as "en" | "es"] || category;
        formattedContent += `\n## ${label}\n`;
        for (const item of items) {
          formattedContent += `### ${item.title}\n${item.content}\n\n`;
        }
      }
    } else {
      formattedContent = language === "es" 
        ? "No hay información del hostel configurada todavía."
        : "No hostel information has been configured yet.";
    }

    const systemPrompt = (language === "es" ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN)
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
