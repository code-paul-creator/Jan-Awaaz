# Jan Awaaz: BRICS Citizen Demand Intelligence
Multilingual AI platform (Digital Public Good) that turns citizen requests into ranked development priorities. Track 1, AI for Digital Public Infrastructure & Governance.

## Deploy on Vercel (full Gemini mode)
1. Push this folder to a GitHub repo, then Import it at vercel.com (no build settings needed).
2. In Project > Settings > Environment Variables add `GEMINI_API_KEY` (from aistudio.google.com/apikey). Optional: `GEMINI_MODEL`.
3. Redeploy. `/api/classify` now powers language detection, sector tagging, urgency and English summaries.

## Deploy on GitHub Pages (static demo)
Repo > Settings > Pages > Source: **GitHub Actions**. Push to `main`. Pages has no server, so the app uses its offline keyword fallback.

Never commit your API key.
