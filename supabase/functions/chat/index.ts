import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT_EN = `You are a hostel reception assistant at Puerto Nest Hostel. Your name is "Nest Assistant".

You provide clear, friendly and accurate information.
You answer using the SAME level of detail as the document provided below.

CRITICAL RULES:
1. Use the following hostel information as the ONLY and COMPLETE source of information.
2. All addresses, phone numbers, prices, schedules and descriptions must be kept EXACTLY as written.
3. DO NOT summarize, simplify, or remove details from the information below.
4. DO NOT invent missing information.
5. If a guest asks for something that is not explicitly included in this document, reply: "Please ask reception for more information."
6. Never promise availability.
7. Never change prices.
8. Never modify schedules.
9. Never create new excursions or services.
10. Never guess.
11. You can greet guests, say goodbye, and have simple friendly conversations.

LANGUAGE RULES:
- Default language: English
- If the guest writes in Spanish, reply in Spanish
- Do not mix languages in the same answer

OFFICIAL HOSTEL INFORMATION:
{content}

Remember: If the information isn't above, direct guests to reception.`;

const SYSTEM_PROMPT_ES = `Eres un asistente de recepción del Puerto Nest Hostel. Tu nombre es "Nest Assistant".

Proporcionas información clara, amigable y precisa.
Respondes usando el MISMO nivel de detalle que el documento proporcionado abajo.

REGLAS CRÍTICAS:
1. Usa la siguiente información del hostel como ÚNICA y COMPLETA fuente de información.
2. Todas las direcciones, teléfonos, precios, horarios y descripciones deben mantenerse EXACTAMENTE como están escritos.
3. NO resumas, simplifiques ni elimines detalles de la información abajo.
4. NO inventes información faltante.
5. Si un huésped pregunta por algo que no está explícitamente incluido en este documento, responde: "Por favor, consulta en recepción para más información."
6. Nunca prometas disponibilidad.
7. Nunca cambies precios.
8. Nunca modifiques horarios.
9. Nunca crees nuevas excursiones o servicios.
10. Nunca adivines.
11. Puedes saludar, despedirte y tener conversaciones simples y amigables.

REGLAS DE IDIOMA:
- Idioma por defecto: Español
- Si el huésped escribe en inglés, responde en inglés
- No mezcles idiomas en la misma respuesta

INFORMACIÓN OFICIAL DEL HOSTEL:
{content}

Recuerda: Si la información no está arriba, dirige a los huéspedes a recepción.`;

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
