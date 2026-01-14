import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Daniel Boyle | Portfolio Terminal",
  description:
    "A terminal-style portfolio for a software developer. Navigate through my experience, skills, and projects using familiar terminal commands.",
  keywords: [
    "portfolio",
    "developer",
    "software engineer",
    "terminal",
    "react",
    "typescript",
    "next.js",
  ],
  authors: [{ name: "Daniel Boyle" }],
  openGraph: {
    title: "Daniel Boyle | Portfolio Terminal",
    description: "A terminal-style portfolio for a software developer",
    type: "website",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden bg-black text-green-500 antialiased">
        {children}
      </body>
    </html>
  );
}
