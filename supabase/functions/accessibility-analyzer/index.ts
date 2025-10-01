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
      systemPrompt = `Você é um consultor especialista em acessibilidade web, especializado em conformidade com WCAG 2.1 AA e AAA. 
Analise o conteúdo HTML em busca de problemas de acessibilidade e forneça recomendações práticas.

Foque em:
- Estrutura HTML semântica
- Atributos e funções ARIA
- Hierarquia de cabeçalhos (um único H1, aninhamento adequado)
- Taxas de contraste de cor
- Navegação por teclado
- Rótulos de formulário e mensagens de erro
- Texto alternativo de imagens
- Indicadores de foco

Forneça sua análise em um formato claro e estruturado com:
1. Resumo (pontuação geral de acessibilidade de 0 a 100)
2. Problemas críticos (deve corrigir imediatamente)
3. Avisos (deve corrigir em breve)
4. Recomendações (melhorias desejáveis)
5. Exemplos de código específicos para correções`;

      userPrompt = `Analise este conteúdo HTML quanto a problemas de acessibilidade:\n\n${htmlContent}`;
    } else if (action === "suggest") {
      systemPrompt = `Você é um consultor especialista em acessibilidade web. Com base no conteúdo HTML fornecido, sugira melhorias específicas para tornar o site mais acessível.
Foque em sugestões práticas e implementáveis com exemplos de código.`;
      
      userPrompt = `Sugira melhorias de acessibilidade para este HTML:\n\n${htmlContent}`;
    } else {
      systemPrompt = `Você é um assistente especialista em acessibilidade. Responda perguntas sobre acessibilidade web, diretrizes WCAG e melhores práticas.`;
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
          JSON.stringify({ error: "Limite de taxa excedido. Por favor, tente novamente mais tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Pagamento necessário. Por favor, adicione créditos ao seu workspace." }),
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
