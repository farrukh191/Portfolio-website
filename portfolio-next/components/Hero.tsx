import OpenChatButton from "./OpenChatButton";
import { CV_PATH } from "@/lib/data";

type Part = string | { s: string };
const lines: { c?: "c" | "k"; p: Part[] }[] = [
  { c: "c", p: ["// verified from my CV"] },
  { c: "k", p: ["const farrukh = {"] },
  { p: ["  role: ", { s: "'Senior Frontend Developer'" }, ","] },
  { p: ["  experience: ", { s: "'4+ years'" }, ","] },
  { p: ["  core: [", { s: "'Vue.js 3'" }, ", ", { s: "'React'" }, ", ", { s: "'TypeScript'" }, "],"] },
  { p: ["  architecture: [", { s: "'micro-frontends'" }, ", ", { s: "'monorepo'" }, "],"] },
  { p: ["  focus: [", { s: "'reusable UI'" }, ", ", { s: "'i18n'" }, ", ", { s: "'REST APIs'" }, "],"] },
  { p: ["  ai: [", { s: "'Copilot'" }, ", ", { s: "'Cursor'" }, ", ", { s: "'n8n'" }, "],"] },
  { p: ["  openToWork: ", { s: "true" }] },
  { p: ["};"] },
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap grid">
        <div>
          <div className="status mono"><span className="dot" />Frontend engineer · Open to opportunities</div>
          <h1>Building thoughtful digital experiences with clean, scalable code.</h1>
          <p className="lead">I’m a frontend developer focused on building reliable, maintainable web applications using React, Vue.js, and modern JavaScript. I enjoy turning complex requirements into reusable UI systems, smooth user experiences, and practical product solutions.</p>
          <div className="cta">
            <a className="btn pri" href="#work">Explore my work</a>
            <a className="btn" href="#contact">Let’s connect</a>
            <a className="btn dlcv" href={CV_PATH} download="Farrukh_Feroz_CV.pdf">Download CV (PDF)</a>
            <OpenChatButton />
          </div>
          <div className="facts mono">
            <span>4+ years</span><span>Vue.js 3 · React · TypeScript</span>
            <span>AI-assisted dev: Copilot · Cursor · Codex</span><span>Karachi, Pakistan</span>
          </div>
        </div>
        <div className="editor" aria-hidden="true">
          <div className="bar mono"><i /><i /><i /><span>farrukh.profile.ts</span></div>
          <pre id="code">
            {lines.map((l, i) => (
              <span key={i} className={"l" + (l.c ? " " + l.c : "")} style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
                {l.p.map((x, j) => (typeof x === "string" ? x : <span key={j} className="s">{x.s}</span>))}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </section>
  );
}
