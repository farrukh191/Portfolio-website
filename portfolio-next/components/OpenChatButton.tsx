"use client";

export default function OpenChatButton() {
  return (
    <button className="btn" id="askhero" type="button" onClick={() => window.dispatchEvent(new Event("open-chat"))}>
      Ask my AI assistant
    </button>
  );
}
