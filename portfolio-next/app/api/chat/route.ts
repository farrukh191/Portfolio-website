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

type LLMResult = { reply?: string; status?: number; missingKey?: boolean };

async function callLLM(messages: Msg[], signal: AbortSignal): Promise<LLMResult> {
  const provider = (process.env.LLM_PROVIDER || "anthropic").toLowerCase();
  if (provider === "openai") {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return { missingKey: true };
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        max_tokens: 400,
        temperature: 0.3,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });
    if (!r.ok) return { status: r.status };
    const d = await r.json();
    return { reply: d.choices?.[0]?.message?.content?.trim() };
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { missingKey: true };
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 400,
      system: SYSTEM,
      messages,
    }),
  });
  if (!r.ok) return { status: r.status };
  const d = await r.json();
  const reply = ((d.content || []) as { type: string; text?: string }[])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return { reply };
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

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
    if (out.missingKey) return json({ error: "AI assistant is not configured." }, 503);
    if (out.status) {
      console.error("LLM provider returned status", out.status);
      return json({ error: "AI service error." }, 502);
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
