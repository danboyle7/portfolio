"use client";

import { initializeContent } from "@/lib/terminal/content-loader";
import { Navigation } from "@/components/modern/Navigation";
import { TechBackground } from "@/components/modern/TechBackground";

// Initialize content cache for modern pages
initializeContent();

export default function ModernLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="modern-portfolio modern-scrollbar min-h-screen bg-slate-950"
      style={{
        fontFamily:
          "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Shared fixed background for all modern pages */}
      <TechBackground />

      {/* Persistent Navigation */}
      <Navigation />

      {children}
    </div>
  );
}
