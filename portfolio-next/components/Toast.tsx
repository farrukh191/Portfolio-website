"use client";
import { useEffect, useRef, useState } from "react";

export default function Toast() {
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const on = (e: Event) => {
      setText((e as CustomEvent<string>).detail);
      setShow(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), 2200);
    };
    window.addEventListener("toast", on);
    return () => window.removeEventListener("toast", on);
  }, []);
  return <div id="toast" className={show ? "show" : undefined} role="status" aria-live="polite">{text}</div>;
}
