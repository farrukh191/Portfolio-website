export const EMAIL = "farrukhferoz12@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/farrukh-feroz";
export const GITHUB = "https://github.com/farrukh191";
export const CV_PATH = "/assets/Farrukh_Feroz_CV.pdf";

export type Project = {
  n: string; t: "web" | "app" | "ai"; cat: string; d: string; role: string;
  ctx: string; st: string[]; pts: string[]; wide?: boolean;
};
/** Certificate: pv = preview image path, f = original file (image or PDF), u = verify link. */
export type Cert = { t: string; i: string; y: string; h?: string; ins?: string; u?: string; pv?: string; f?: string };

export const projects: Project[] = [
  {
    "n": "Williams-Sonoma, Inc. (WSI)",
    "t": "web",
    "cat": "Phygital commerce · Professional",
    "d": "Feb 2026 – Aug 2026",
    "role": "Software Engineer / Senior Software Engineer",
    "ctx": "A phygital commerce platform where users design, visualize and share interior and exterior spaces digitally. It runs on a monorepo and micro-frontend architecture with analytics and localization across brands and regional markets.",
    "st": [
      "Vue.js 3",
      "Vuex",
      "Monorepo",
      "Micro-frontends"
    ],
    "pts": [
      "Developed and enhanced frontend features for digital interior and exterior design experiences.",
      "Delivered features across shared packages and independently deployed modules.",
      "Integrated analytics to track user behavior, engagement and revenue-generating pages.",
      "Implemented language selector support for CAN and US markets across eight brands.",
      "Improved reusable component architecture and maintainability.",
      "Supported UAT, production deployments and post-release stabilization.",
      "Used GitHub Copilot, Cursor and OpenAI Codex to speed up development and refactoring."
    ],
    "wide": true
  },
  {
    "n": "Progleasing (PROG)",
    "t": "web",
    "cat": "Fintech · Professional",
    "d": "Dec 2025 – Jan 2026",
    "role": "Software Engineer",
    "ctx": "A web application with secure banking connectivity through third-party financial integration services.",
    "st": [
      "React.js",
      "Material UI",
      "Node.js",
      "Express.js",
      "Plaid SDK"
    ],
    "pts": [
      "Built frontend features with React.js and Material UI, with Node.js and Express.js backend support.",
      "Implemented Plaid SDK and Hosted Link integrations, including Plaid flows inside WebViews.",
      "Evaluated SDK-based and hosted approaches and documented the differences to guide implementation decisions.",
      "Supported integration testing and troubleshooting."
    ]
  },
  {
    "n": "Galaxefi",
    "t": "web",
    "cat": "Shipment tracking & invoicing · Professional",
    "d": "Mar 2022 – Aug 2022",
    "role": "Frontend Developer / Software Engineer",
    "ctx": "Responsive web applications with real-time shipment tracking, automated invoicing and digital documentation workflows.",
    "st": [
      "React.js",
      "Redux",
      "Ant Design",
      "Axios"
    ],
    "pts": [
      "Integrated 40+ REST APIs.",
      "Developed 17+ reusable custom components for consistency and maintainability, plus 20+ custom components for the user experience.",
      "Refactored the codebase for scalability, maintainability and performance.",
      "Worked on layout, styling and UI improvements, and helped test and debug frontend modules."
    ]
  },
  {
    "n": "Causevest",
    "t": "app",
    "cat": "Crypto wallet desktop app · Professional",
    "d": "",
    "role": "Associate Frontend Developer",
    "ctx": "A crypto wallet desktop application built with React.js and Electron.js.",
    "st": [
      "React.js",
      "Electron.js",
      "Redux"
    ],
    "pts": [
      "Developed multiple components of the wallet application.",
      "Kept code quality high and optimized desktop application workflows.",
      "Worked with SQA to find and fix bugs."
    ]
  },
  {
    "n": "Clara Carbon",
    "t": "app",
    "cat": "Cross-platform mobile app · Professional",
    "d": "",
    "role": "Associate Frontend Developer",
    "ctx": "A cross-platform mobile application built with Ionic, Angular and Capacitor.",
    "st": [
      "Ionic",
      "Angular",
      "Capacitor",
      "Stripe"
    ],
    "pts": [
      "Built the dashboard, signup and product listing modules.",
      "Integrated the Stripe payment gateway for in-app payments.",
      "Implemented image-saving functionality."
    ]
  },
  {
    "n": "Automated AI Code Reviewer",
    "t": "ai",
    "cat": "AI · Personal project, not production work",
    "d": "",
    "role": "Personal project",
    "ctx": "An AI-powered pull request review system that uses LLMs and the GitHub API to automate code review feedback.",
    "st": [
      "Node.js",
      "GitHub API",
      "Gemini API"
    ],
    "pts": [
      "Parses pull request diffs.",
      "Generates automated inline code-review comments with an LLM."
    ],
    "wide": true
  }
];

export const skills: [string, string[]][] = [
  [
    "Languages",
    [
      "JavaScript (ES6+)",
      "TypeScript",
      "HTML5",
      "CSS3",
      "PHP",
      "SQL"
    ]
  ],
  [
    "Frontend",
    [
      "React.js",
      "Vue.js 3",
      "Angular",
      "Ionic",
      "Vuex",
      "Redux",
      "Material UI",
      "Ant Design",
      "Tailwind CSS"
    ]
  ],
  [
    "Architecture",
    [
      "Monorepo and micro-frontends (hands-on)",
      "Reusable component libraries",
      "REST API integration",
      "State management",
      "Localization (i18n)"
    ]
  ],
  [
    "Backend & data",
    [
      "Node.js",
      "Express.js",
      "Apache Tomcat",
      "MySQL",
      "SQL Server"
    ]
  ],
  [
    "AI & automation",
    [
      "GitHub Copilot",
      "OpenAI Codex",
      "Cursor",
      "n8n workflow automation",
      "LLM APIs (Gemini)",
      "GitHub API"
    ]
  ],
  [
    "Tools & integrations",
    [
      "Git, GitHub, GitLab",
      "Jira, Confluence",
      "Vite, Webpack",
      "Capacitor, Electron.js",
      "Postman, Swagger",
      "Plaid, Stripe",
      "Axios"
    ]
  ]
];

/** Add certificates here. For a PDF: pv = PNG/JPG of page 1, f = the PDF. Files go in public/assets/certificates/. */
export const certs: Cert[] = [
  {
    "t": "AI Builder: Create Agents, Voice Agents & Automations in n8n",
    "i": "Udemy",
    "y": "Oct 2026",
    "h": "14.5 hours",
    "ins": "Ligency, Ed Donner",
    "u": "https://ude.my/UC-424ac49c-924c-48de-ba00-cb76db8e5f4d",
    "pv": "assets/certificates/n8n-preview.jpg",
    "f": "assets/certificates/n8n-certificate.jpg"
  }
];

export const roles = [
  {
    title: "Senior Frontend Developer",
    meta: "Nisum · Karachi · May 2022 – Present",
    bullets: [
      "Built scalable web applications with Vue.js, React, Node.js and Express.js.",
      "Worked on phygital commerce platforms for designing, visualizing and sharing interior and exterior spaces.",
      "Delivered features in a monorepo and micro-frontend architecture on the WSI project with cross-functional teams.",
      "Implemented secure integrations including Plaid SDK and hosted banking flows.",
      "Built analytics to track user behavior, engagement and revenue-generating pages.",
      "Integrated 40+ REST APIs and built reusable UI components across projects.",
      "Improved performance, maintainability and localization across multiple brands and regions.",
      "Supported UAT, production deployments, troubleshooting and post-release stabilization.",
    ],
    stack: ["Vue.js 3", "Vuex", "React", "Node.js", "Express.js", "Plaid SDK", "Copilot", "Cursor", "n8n"],
  },
  {
    title: "Associate Frontend Developer",
    meta: "Aim Solutions · Karachi · Dec 2021 – May 2022",
    bullets: [
      "Enhanced existing applications across web, desktop and mobile with React, Angular, Ionic, Capacitor and Electron.js.",
      "Built reusable UI modules and resolved production bugs for stable releases.",
      "Worked with SQA to reproduce and fix defects, and took part in code reviews.",
    ],
    stack: ["React", "Angular", "Ionic", "Capacitor", "Electron.js"],
  },
];

export const suggestions = [
  "What are Farrukh’s main technical skills?",
  "Does he have experience with micro-frontends?",
  "What did he do on the shipment tracking project?",
  "What AI or automation projects is he exploring?",
  "Why might he be a good fit for a frontend role?",
  "Is he open to new opportunities?",
  "How can I contact him?",
];
