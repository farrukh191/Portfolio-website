export default function About() {
  return (
    <section id="about">
      <div className="wrap about">
        <div>
          <h2>About me</h2>
          <p className="lead" style={{ marginTop: 24 }}>I’m a frontend developer who enjoys turning complex requirements into clear, maintainable interfaces. My work includes reusable components, product-focused UI development, API-driven experiences, and localization across modern web applications.</p>
          <p className="lead">I care about code quality, thoughtful architecture, performance, accessibility, and collaboration. I also explore AI-assisted development and workflow automation to discover practical ways to improve how software is built and delivered.</p>
        </div>
        <div className="nums">
          <div><b>4+</b><span>years in frontend development</span></div>
          <div><b>40+</b><span>REST APIs integrated</span></div>
          <div><b>8</b><span>brands with CAN &amp; US language selector</span></div>
          <div><b>2</b><span>companies: Nisum, Aim Solutions</span></div>
        </div>
      </div>
    </section>
  );
}
