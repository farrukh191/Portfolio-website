import { roles } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <h2 style={{ marginBottom: 48 }}>Experience</h2>
        <div className="tl">
          {roles.map((r) => (
            <div className="role" key={r.title}>
              <h3>{r.title}</h3>
              <div className="meta mono">{r.meta}</div>
              <ul>{r.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              <div className="stack mono">{r.stack.map((s) => <span key={s}>{s}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="edu"><b>Bachelor of Computer Science</b> · Federal Urdu University of Arts, Science and Technology, Karachi · 2021</div>
      </div>
    </section>
  );
}
