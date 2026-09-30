// Vercel serverless function. Set GEMINI_API_KEY in Vercel > Settings > Environment Variables.
const SECTORS = ["water", "roads", "health", "edu", "energy", "digital"];
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY not set" });
  const text = String((req.body && req.body.text) || "").slice(0, 1000);
  if (!text) return res.status(400).json({ error: "text required" });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = `You triage citizen development requests for a government. The request may be in any language.
Return JSON only: {"language": English name of the language, "sector": one of ${JSON.stringify(SECTORS)} (water=water & sanitation, roads=roads & transport, health=healthcare, edu=education, energy=electricity/power, digital=internet & connectivity), "urgent": true if life, health or safety is at immediate risk, "summary_en": one-sentence English summary}.
Request: """${text}"""`;
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0 },
      }),
    });
    if (!r.ok) return res.status(502).json({ error: "Gemini error " + r.status });
    const data = await r.json();
    const out = JSON.parse(data.candidates[0].content.parts[0].text);
    if (!SECTORS.includes(out.sector)) return res.status(422).json({ error: "bad sector" });
    return res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ error: "classification failed" });
  }
};
