import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <h2 style={{ marginBottom: 40 }}>Skills</h2>
        <div className="skills">
          {skills.map(([title, list]) => (
            <div className="card" key={title}>
              <h3>{title}</h3>
              <div className="stack mono">{list.map((x) => <span key={x}>{x}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
