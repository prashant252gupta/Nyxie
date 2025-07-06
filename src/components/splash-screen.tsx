"use client";

import { useEffect } from "react";

type SplashScreenProps = {
  onComplete: () => void;
};

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in-out">
      <h1 className="font-headline text-8xl font-bold text-primary">Nyxie</h1>
      <p className="font-body text-xl text-muted-foreground mt-2">
        talk dirty, undress minds
      </p>
    </div>
  );
}
