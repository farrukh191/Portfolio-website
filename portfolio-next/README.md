# Farrukh Feroz: Portfolio (Next.js)

Next.js (App Router) + React + TypeScript. Same design as the original static site; styles live in `app/globals.css`.

## Structure
```
app/layout.tsx            metadata, fonts, theme script
app/page.tsx              page composed from components
app/api/chat/route.ts     POST /api/chat: validation, rate limit, LLM call (server only)
app/globals.css           design tokens, dark/light themes, all styles
components/               Header, Hero, Projects, About, Skills, Experience, Certifications, Contact, Chat, Toast
lib/data.ts               ALL site content: projects, skills, certificates, roles
lib/knowledge.ts          builds the AI assistant's knowledge from lib/data.ts
public/assets/            CV PDF and certificate files
cv-source/cv.tex          LaTeX CV source (open in Overleaf)
```

## Run locally
```bash
npm install
cp .env.example .env.local   # add your API key
npm run dev                  # http://localhost:3000
npm run typecheck
npm run build
```

## Deploy (GitHub -> Vercel)
1. Push this folder to a GitHub repo (branch `main`).
2. Vercel: Add New > Project > import the repo. Framework Preset is detected as Next.js; keep the defaults.
3. Settings > Environment Variables: add `LLM_PROVIDER` and `ANTHROPIC_API_KEY` (or the OpenAI ones). Redeploy after changing them.
4. Every push to `main` redeploys. Other branches get preview URLs.

## Update content
- Certificates, projects, skills, roles: edit `lib/data.ts`. The AI assistant picks up the same data automatically.
- For a PDF certificate, set `pv` to a PNG/JPG of page 1 and `f` to the PDF, both in `public/assets/certificates/`.
- CV: edit `cv-source/cv.tex` in Overleaf, export the PDF, replace `public/assets/Farrukh_Feroz_CV.pdf`.

## Known limits
- The rate limiter is in memory per serverless instance (best effort). Use Upstash Redis / Vercel KV for strict limits.
- Conversations are not stored; messages go to the LLM provider you configure.
