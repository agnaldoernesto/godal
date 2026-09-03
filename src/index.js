export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === "GET") {
      return new Response(
        JSON.stringify({ status: "OK", message: "Worker godal ativo e operacional!" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (request.method === "POST") {
      try {
        const { type, query } = await request.json();
        const apiKey = env.LLM_API_KEY;

        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Variável LLM_API_KEY não configurada no painel do Cloudflare." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        let promptText = "";
        if (type === "device") {
          promptText = `Atue como um analista de mercado de eletrônicos. Busque o equipamento: "${query}". Retorne APENAS um objeto JSON válido com as chaves exatas: "marca", "modelo", "ano_de_fabrico", "preco_oficial", "preco_segunda_mao", "preco_marketplace", "intervalo_preco_sugerido".`;
        } else if (type === "person") {
          promptText = `Atue como um pesquisador de dados abertos. Busque informações públicas sobre: "${query}". Gere no máximo 3 perfis e retorne APENAS uma lista (array) JSON válida com: "nome_sobrenome", "idade", "residencia", "escola_formacao", "numeros_associados", "trabalho_atual_antigo", "cargo", "familiares", "redes_sociais", "informacoes_adicionais".`;
        } else {
          return new Response(
            JSON.stringify({ error: "Tipo de pesquisa inválido." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const llmUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const llmResponse = await fetch(llmUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { response_mime_type: "application/json" },
          }),
        });

        const llmData = await llmResponse.json();

        if (!llmResponse.ok) {
          return new Response(
            JSON.stringify({ error: llmData.error?.message || "Erro na API Gemini" }),
            { status: llmResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const rawOutput = llmData.candidates[0].content.parts[0].text;

        return new Response(rawOutput, {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Método não permitido." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },
};