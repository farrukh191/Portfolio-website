"use client";
import { EMAIL } from "@/lib/data";
import { toast } from "@/lib/toast";

export default function CopyEmailButton() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast("Email copied");
    } catch {
      toast(EMAIL);
    }
  };
  return <button className="btn" id="copy" type="button" onClick={copy}>Copy email</button>;
}
