import { SYSTEM } from "@/lib/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 25;

type Msg = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 10;
const MAX_CHARS = 500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20; // per IP per window (best effort: memory is per serverless instance)
const hits = new Map<string, number[]>();
const isDev = process.env.NODE_ENV !== "production";

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_REQUESTS;
}

function validate(body: unknown): Msg[] | null {
  const m = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(m) || m.length < 1 || m.length > MAX_MESSAGES) return null;
  const out: Msg[] = [];
  for (const x of m) {
    if (!x || (x.role !== "user" && x.role !== "assistant") || typeof x.content !== "string") return null;
    const content = x.content.trim();
    if (!content || content.length > MAX_CHARS) return null;
    out.push({ role: x.role, content });
  }
  if (out[0].role !== "user" || out[out.length - 1].role !== "user") return null;
  return out;
}

/** Reads an env value safely: trims, removes quotes and inline "# comments", ignores placeholders. */
function env(name: string): string | undefined {
  let v = process.env[name];
  if (!v) return undefined;
  v = v.replace(/\s+#.*$/, "").trim().replace(/^["']|["']$/g, "").trim();
  if (!v || /^your_|_here$|^xxx/i.test(v)) return undefined;
  return v;
}

type Provider = {
  kind: "openai-compatible" | "anthropic";
  url: string;
  keyEnv: string;
  modelEnv: string;
  model: string;
  tokenParam?: string;
  authMode?: "bearer" | "google-key";
};

const PROVIDERS: Record<string, Provider> = {
  groq: {
    kind: "openai-compatible",
    url: "https://api.groq.com/openai/v1/chat/completions",
    keyEnv: "GROQ_API_KEY",
    modelEnv: "GROQ_MODEL",
    model: "qwen/qwen3.8-27b",
    tokenParam: "max_completion_tokens",
  },
  gemini: {
    kind: "openai-compatible",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keyEnv: "GEMINI_API_KEY",
    modelEnv: "GEMINI_MODEL",
    model: "gemini-3.8-flash",
    tokenParam: "max_tokens",
    authMode: "google-key",
  },
  openai: {
    kind: "openai-compatible",
    url: "https://api.openai.com/v1/chat/completions",
    keyEnv: "OPENAI_API_KEY",
    modelEnv: "OPENAI_MODEL",
    model: "gpt-4o-mini",
    tokenParam: "max_tokens",
  },
  anthropic: {
    kind: "anthropic",
    url: "https://api.anthropic.com/v1/messages",
    keyEnv: "ANTHROPIC_API_KEY",
    modelEnv: "ANTHROPIC_MODEL",
    model: "claude-haiku-5-5",
  },
};

/** Uses LLM_PROVIDER if its key exists, otherwise the first provider that has a key. */
function pickProvider(): { name: string; cfg: Provider; key: string } | null {
  const wanted = (env("LLM_PROVIDER") || "").toLowerCase();
  const order = [wanted, "groq", "gemini", "openai", "anthropic"].filter((n, i, a) => PROVIDERS[n] && a.indexOf(n) === i);
  for (const name of order) {
    const key = env(PROVIDERS[name].keyEnv);
    if (key) return { name, cfg: PROVIDERS[name], key };
  }
  return null;
}

type LLMResult = { reply?: string; status?: number; provider?: string };

function buildRequestUrl(cfg: Provider, key: string) {
  if (cfg.authMode === "google-key") {
    const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent`);
    url.searchParams.set("key", key);
    return url.toString();
  }
  return cfg.url;
}

async function callLLM(messages: Msg[], signal: AbortSignal): Promise<LLMResult | null> {
  const picked = pickProvider();
  if (!picked) return null;
  const { name, cfg, key } = picked;
  const model = env(cfg.modelEnv) || cfg.model;

  if (cfg.kind === "anthropic") {
    const r = await fetch(cfg.url, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 400, system: SYSTEM, messages }),
    });
    if (!r.ok) return { status: r.status, provider: name };
    const d = await r.json();
    const reply = ((d.content || []) as { type: string; text?: string }[])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return { reply, provider: name };
  }

  if (cfg.authMode === "google-key") {
    const requestUrl = buildRequestUrl({ ...cfg, model }, key);
    const requestBody = {
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: messages.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
      generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
    };

    const r = await fetch(requestUrl, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (!r.ok) return { status: r.status, provider: name };
    const d = await r.json();
    const reply = d.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("\n").trim();
    return { reply, provider: name };
  }

  const requestUrl = cfg.url;
  const r = await fetch(requestUrl, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({
      model,
      [cfg.tokenParam as string]: 400,
      temperature: 0.3,
      messages: [{ role: "system", content: SYSTEM }, ...messages],
    }),
  });
  if (!r.ok) return { status: r.status, provider: name };
  const d = await r.json();
  return { reply: d.choices?.[0]?.message?.content?.trim(), provider: name };
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Setup check: open http://localhost:3000/api/chat in the browser. Never returns keys. */
export async function GET() {
  const p = pickProvider();
  return json({
    configured: !!p,
    provider: p?.name ?? null,
    model: p ? env(p.cfg.modelEnv) || p.cfg.model : null,
    hint: p ? "Ready." : "No API key found. Add GROQ_API_KEY or GEMINI_API_KEY to .env.local, then restart the dev server.",
  });
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return json({ error: "Too many requests. Please try again in a few minutes." }, 429);

  const body = await req.json().catch(() => null);
  const messages = validate(body);
  if (!messages) return json({ error: "Invalid request. Keep each message under " + MAX_CHARS + " characters." }, 400);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const out = await callLLM(messages, ctrl.signal);
    if (!out) {
      return json(
        { error: "AI assistant is not configured.", ...(isDev && { hint: "Open /api/chat in your browser for a setup check." }) },
        503
      );
    }
    if (out.status) {
      console.error(`LLM provider "${out.provider}" returned status ${out.status}`);
      return json({ error: "AI service error.", ...(isDev && { provider: out.provider, status: out.status }) }, 502);
    }
    if (!out.reply) return json({ error: "Empty response." }, 502);
    return json({ reply: out.reply });
  } catch (e) {
    console.error("chat error:", (e as Error)?.name);
    return json({ error: "AI service unavailable." }, 502);
  } finally {
    clearTimeout(timer);
  }
}
