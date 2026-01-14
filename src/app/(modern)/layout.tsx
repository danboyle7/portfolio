"use client";

import { initializeContent } from "@/lib/terminal/content-loader";
import { Navigation } from "@/components/modern/Navigation";

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
      <div className="pointer-events-none fixed inset-0 bg-slate-950">
        <div className="absolute top-1/4 -left-32 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-600/20 blur-[128px]" />
        <div
          className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-indigo-600/15 blur-[100px]"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-linear-to-br from-blue-950/20 via-transparent to-indigo-950/20" />
      </div>

      {/* Persistent Navigation */}
      <Navigation />

      {children}
    </div>
  );
}
