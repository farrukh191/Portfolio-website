"use client";
import { useEffect, useRef, useState } from "react";
import { EMAIL, suggestions } from "@/lib/data";

type Msg = { id: number; role: "a" | "u"; text: string; err?: boolean; typing?: boolean };
type Turn = { role: "user" | "assistant"; content: string };

const WELCOME =
  "Hi! I’m Farrukh’s AI assistant. Ask me about his skills, projects or availability. I answer from his CV, and I’ll say so when I don’t know.";

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: "a", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const hist = useRef<Turn[]>([]);
  const last = useRef(0);
  const nid = useRef(1);
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const launch = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    launch.current?.focus();
  };

  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener("open-chat", o);
    return () => window.removeEventListener("open-chat", o);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => field.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [msgs]);

  async function ask(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    if (Date.now() - last.current < 1500) return;
    last.current = Date.now();
    const uid = nid.current++;
    const wid = nid.current++;
    hist.current.push({ role: "user", content: text });
    setMsgs((m) => [...m, { id: uid, role: "u", text }, { id: wid, role: "a", text: "", typing: true }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: hist.current.slice(-7) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw { code: res.status === 429 ? "rate_limited" : "unavailable" };
      hist.current.push({ role: "assistant", content: data.reply });
      setMsgs((m) => m.map((x) => (x.id === wid ? { ...x, text: data.reply, typing: false } : x)));
    } catch (err) {
      hist.current.pop();
      const msg =
        (err as { code?: string })?.code === "rate_limited"
          ? "Too many questions in a short time. Please wait a moment and try again."
          : "The AI assistant isn’t available right now. You can email Farrukh directly at " + EMAIL + ".";
      setMsgs((m) => m.map((x) => (x.id === wid ? { ...x, text: msg, typing: false, err: true } : x)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button id="launch" ref={launch} type="button" aria-expanded={open} aria-controls="chat" onClick={() => (open ? close() : setOpen(true))}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
        Ask My AI Assistant
      </button>
      <section id="chat" className={open ? "open" : undefined} role="dialog" aria-label="AI assistant chat" style={{ padding: 0 }}>
        <div className="ch">
          <div><b>Farrukh’s AI assistant</b><small>AI-generated answers from his CV. Not Farrukh himself.</small></div>
          <button className="x" type="button" aria-label="Close chat" onClick={close}>×</button>
        </div>
        <div id="log" ref={log} role="log" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`m ${m.role}${m.err ? " e" : ""}`}>
              {m.typing ? <span className="typing" aria-label="Assistant is typing"><i /><i /><i /></span> : m.text}
            </div>
          ))}
        </div>
        <div id="sug">
          {suggestions.map((s) => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}
        </div>
        <form id="f" autoComplete="off" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
          <input id="q" ref={field} value={input} onChange={(e) => setInput(e.target.value)} maxLength={500}
            placeholder="Ask about skills, projects, availability…" aria-label="Your question" />
          <button className="btn pri" type="submit" disabled={busy}>Send</button>
        </form>
      </section>
    </>
  );
}
