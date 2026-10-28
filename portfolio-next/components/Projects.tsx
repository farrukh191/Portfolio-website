"use client";
import { useState } from "react";
import { projects, type Project } from "@/lib/data";

const filters: [string, string][] = [["all", "All"], ["web", "Web"], ["app", "Mobile & desktop"], ["ai", "AI"]];

function ProjectCard({ p, id }: { p: Project; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={"card" + (p.wide ? " wide" : "")}>
      <div className="tag mono">{p.cat}</div>
      <h3>{p.n}</h3>
      <div className="mono">{p.role + (p.d ? " · " + p.d : "")}</div>
      <p>{p.ctx}</p>
      <div className="stack mono">{p.st.map((s) => <span key={s}>{s}</span>)}</div>
      <div className={"detail" + (open ? " open" : "")} id={id}>
        <ul>{p.pts.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <button className="more" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {open ? "Hide details" : "View details"}
      </button>
    </article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("all");
  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head">
          <h2>Selected work</h2>
          <div className="chips" role="group" aria-label="Filter projects">
            {filters.map(([k, label]) => (
              <button key={k} className="chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
            ))}
          </div>
        </div>
        <div className="projects">
          {projects.map((p, i) => (filter === "all" || p.t === filter) && <ProjectCard key={p.n} p={p} id={"d" + i} />)}
        </div>
      </div>
    </section>
  );
}
