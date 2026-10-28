import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: "Farrukh Feroz — Senior Frontend Developer (React, Vue.js, TypeScript)",
  description:
    "Farrukh Feroz is a frontend developer with 4+ years of experience building scalable React and Vue.js applications, micro-frontends and reusable UI systems.",
  openGraph: {
    title: "Farrukh Feroz — Senior Frontend Developer",
    description: "React, Vue.js and TypeScript. Micro-frontends, reusable components, API integrations and AI-assisted development.",
    type: "website",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem("ff-theme")||"dark"}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Toast />
      </body>
    </html>
  );
}
