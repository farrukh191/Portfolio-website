"use client";
import { useEffect, useState } from "react";

const links: [string, string][] = [
  ["home", "Home"], ["work", "Work"], ["about", "About"], ["skills", "Skills"],
  ["experience", "Experience"], ["certifications", "Certificates"], ["contact", "Contact"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [active, setActive] = useState("home");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll("main section").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem("ff-theme", next); } catch {}
  };

  return (
    <header>
      <nav className="wrap" aria-label="Main">
        <a className="logo" href="#home" aria-label="Farrukh Feroz, home">F<b>F</b></a>
        <button className="theme" type="button" onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </button>
        <button className="burger" aria-expanded={open} aria-controls="links"
          aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <ul className={"links" + (open ? " open" : "")} id="links" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          {links.map(([id, label]) => (
            <li key={id}><a href={"#" + id} className={active === id ? "on" : undefined}>{label}</a></li>
          ))}
          <li><a className="btn pri" href="#contact">Let’s connect</a></li>
        </ul>
      </nav>
    </header>
  );
}
