"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, PortfolioSplash } from "@/components/terminal";

type PortfolioMode = "splash" | "terminal";

export default function Home() {
  const [mode, setMode] = useState<PortfolioMode>("splash");
  const router = useRouter();

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
