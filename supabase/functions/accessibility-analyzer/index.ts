import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { htmlContent, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "analyze") {
      systemPrompt = `You are an expert web accessibility consultant specializing in WCAG 2.1 AA and AAA compliance. 
Analyze HTML content for accessibility issues and provide actionable recommendations.

Focus on:
- Semantic HTML structure
- ARIA attributes and roles
- Heading hierarchy (single H1, proper nesting)
- Color contrast ratios
- Keyboard navigation
- Form labels and error messages
- Image alt text
- Focus indicators

Provide your analysis in a clear, structured format with:
1. Summary (overall accessibility score out of 100)
2. Critical issues (must fix immediately)
3. Warnings (should fix soon)
4. Recommendations (nice to have improvements)
5. Specific code examples for fixes`;

      userPrompt = `Analyze this HTML content for accessibility issues:\n\n${htmlContent}`;
    } else if (action === "suggest") {
      systemPrompt = `You are an expert web accessibility consultant. Based on the HTML content provided, suggest specific improvements to make the website more accessible.
Focus on practical, implementable suggestions with code examples.`;
      
      userPrompt = `Suggest accessibility improvements for this HTML:\n\n${htmlContent}`;
    } else {
      systemPrompt = `You are a helpful accessibility expert assistant. Answer questions about web accessibility, WCAG guidelines, and best practices.`;
      userPrompt = htmlContent; // In chat mode, htmlContent contains the user's question
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const analysisResult = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ result: analysisResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in accessibility-analyzer:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
