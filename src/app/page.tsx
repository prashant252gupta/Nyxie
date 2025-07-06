"use client";

import { useState } from "react";
import SplashScreen from "@/components/splash-screen";
import VibeQuiz from "@/components/vibe-quiz";
import MainApp from "@/components/main-app";

export default function Home() {
  const [appState, setAppState] = useState<"splash" | "quiz" | "main">(
    "splash"
  );
  const [personalityInsights, setPersonalityInsights] = useState<string | null>(
    null
  );

  const handleQuizComplete = (insights: string) => {
    setPersonalityInsights(insights);
    setAppState("main");
  };

  const renderState = () => {
    switch (appState) {
      case "splash":
        return <SplashScreen onComplete={() => setAppState("quiz")} />;
      case "quiz":
        return <VibeQuiz onComplete={handleQuizComplete} />;
      case "main":
        return <MainApp personalityInsights={personalityInsights} />;
      default:
        return <SplashScreen onComplete={() => setAppState("quiz")} />;
    }
  };

  return (
    <main className="min-h-screen w-full">{renderState()}</main>
  );
}
