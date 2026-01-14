import "@/styles/globals.css";

import { type Metadata } from "next";
import { Fira_Code } from "next/font/google";

// Font for the terminal portfolio
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daniel Boyle's Portfolio",
  description:
    "Daniel Boyle's portfolio - a software developer showcasing experience, skills, and projects.",
  keywords: [
    "portfolio",
    "developer",
    "software engineer",
    "terminal",
    "react",
    "typescript",
    "next.js",
    "daniel w boyle",
    "daniel walker boyle"
  ],
  authors: [{ name: "Daniel Boyle" }],
  openGraph: {
    title: "Daniel Boyle's Portfolio",
    description: "Daniel Boyle's portfolio - a software developer showcasing experience, skills, and projects.",
    type: "website",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${firaCode.variable}`}>
      <body className="overflow-x-hidden bg-black font-mono text-green-500 antialiased">
        {children}
      </body>
    </html>
  );
}
