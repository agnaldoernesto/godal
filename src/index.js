export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "GET") {
      return new Response(
        JSON.stringify({ status: "OK", message: "Worker godal ativo e operacional!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (request.method === "POST") {
      try {
        const apiKey = env.LLM_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Variável LLM_API_KEY não configurada no painel do Cloudflare." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body = await request.json();
        const query = body.query || "Nokia 3310";

const llmUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(llmUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Analise o seguinte item: ${query}` }] }]
          })
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response("Método não suportado", { status: 405, headers: corsHeaders });
  }
};
