// src/integrations/Core.js
export async function InvokeLLM({ prompt, response_json_schema }) {
  // Implementiere hier den Aufruf deiner LLM-Integration
  return fetch("/api/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, schema: response_json_schema })
  }).then(res => res.json());
}
