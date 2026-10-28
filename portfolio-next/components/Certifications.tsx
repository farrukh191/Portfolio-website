"use client";
import { useRef, useState } from "react";
import { certs } from "@/lib/data";

export default function Certifications() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState({ src: "", alt: "" });
  const show = (src: string, alt: string) => {
    setView({ src, alt });
    dialog.current?.showModal();
  };

  return (
    <section id="certifications">
      <div className="wrap">
        <h2 style={{ marginBottom: 40 }}>Certifications</h2>
        <div className={"certs" + (certs.length === 1 ? " one" : "")}>
          {certs.length === 0 && <article className="card"><h3>Certificates coming soon</h3></article>}
          {certs.map((x) => (
            <article className="card" key={x.t}>
              {x.pv && (
                <button className="thumb" type="button" aria-label={"View certificate: " + x.t} onClick={() => show(x.pv!, x.t)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={x.pv} alt={"Certificate preview: " + x.t} loading="lazy" />
                </button>
              )}
              <div className="tag mono">{x.i + " · " + x.y + (x.h ? " · " + x.h : "")}</div>
              <h3>{x.t}</h3>
              {x.ins && <p>{"Instructors: " + x.ins}</p>}
              <div className="cta">
                {x.pv && <button className="btn" type="button" onClick={() => show(x.pv!, x.t)}>View</button>}
                {x.u && <a className="btn" href={x.u} target="_blank" rel="noopener noreferrer">Verify</a>}
                {x.f && <a className="btn" href={x.f} download>Download</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
      <dialog id="lb" ref={dialog} aria-label="Certificate viewer"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <button id="lbc" type="button" aria-label="Close certificate viewer" onClick={() => dialog.current?.close()}>×</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img id="lbi" src={view.src || undefined} alt={view.alt} />
      </dialog>
    </section>
  );
}
