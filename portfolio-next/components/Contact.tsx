import CopyEmailButton from "./CopyEmailButton";
import { CV_PATH, EMAIL, GITHUB, LINKEDIN } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="contact">
          <h2>Have a frontend role or product challenge in mind?</h2>
          <p className="lead">I’m interested in opportunities where I can build useful products, solve engineering problems, and collaborate with strong teams.</p>
          <div className="cta">
            <a className="btn pri" href={`mailto:${EMAIL}?subject=Opportunity%20for%20Farrukh`}>{EMAIL}</a>
            <a className="btn" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn" href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="btn dlcv" href={CV_PATH} download="Farrukh_Feroz_CV.pdf">Download CV (PDF)</a>
            <CopyEmailButton />
          </div>
        </div>
      </div>
    </section>
  );
}
