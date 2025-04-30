// mistral.js

async function fetchMistralAI(promptText) {
  const apiKey = "VOTRE_CLE_API_MISTRAL"; // Remplacer par votre vraie clé API
  const endpoint = "https://api.mistral.ai/v1/chat/completions";

  const payload = {
    model: "mistral-small", // ou le modèle Mistral que vous utilisez
    messages: [
      { role: "system", content: "Tu es un expert du jardinage et des potagers à petite échelle." },
      { role: "user", content: promptText }
    ],
    temperature: 0.7
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error("Erreur API Mistral");

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
