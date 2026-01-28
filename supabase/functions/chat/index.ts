import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT_EN = `You are a helpful virtual assistant for Puerto Nest Hostel. Your name is "Nest Assistant".

CRITICAL RULES:
1. You can ONLY answer questions using the hostel information provided below. 
2. If you don't have information to answer a question, say: "I don't have that information available. Please ask our reception staff for help."
3. NEVER make up or guess information. NEVER browse the internet.
4. Be friendly, warm, and welcoming in your responses.
5. Keep answers concise and easy to understand.
6. If asked about prices, times, or specific details not in your knowledge, direct guests to reception.
7. You can greet guests, say goodbye, and have simple friendly conversations.
8. Always respond in the same language the guest is using.

HOSTEL INFORMATION:
{content}

Remember: If the information isn't above, you don't know it. Be helpful but honest.`;

const SYSTEM_PROMPT_ES = `Eres un asistente virtual amigable del Hostel Puerto Nest. Tu nombre es "Nest Assistant".

REGLAS CRÍTICAS:
1. SOLO puedes responder preguntas usando la información del hostel proporcionada abajo.
2. Si no tienes información para responder, di: "No tengo esa información disponible. Por favor, consulta con el personal de recepción."
3. NUNCA inventes o adivines información. NUNCA navegues por internet.
4. Sé amigable, cálido y acogedor en tus respuestas.
5. Mantén las respuestas concisas y fáciles de entender.
6. Si preguntan por precios, horarios o detalles específicos que no tienes, dirígelos a recepción.
7. Puedes saludar, despedirte y tener conversaciones simples y amigables.
8. Siempre responde en el mismo idioma que usa el huésped.

INFORMACIÓN DEL HOSTEL:
{content}

Recuerda: Si la información no está arriba, no la sabes. Sé servicial pero honesto.`;

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
