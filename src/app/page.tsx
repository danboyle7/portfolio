"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Terminal, PortfolioSplash } from "@/components/terminal";

type PortfolioMode = "splash" | "terminal";

export default function Home() {
  const [mode, setMode] = useState<PortfolioMode>("splash");
  const router = useRouter();

  // Update document title based on mode
  useEffect(() => {
    document.title =
      mode === "terminal"
        ? "Daniel Boyle's Portfolio | Terminal"
        : "Daniel Boyle's Portfolio";
  }, [mode]);

  if (mode === "splash") {
    return (
      <PortfolioSplash
        onSelectTerminal={() => setMode("terminal")}
        onSelectModern={() => router.push("/portfolio")}
      />
    );
  }

  return <Terminal onBackToSplash={() => setMode("splash")} />;
}
