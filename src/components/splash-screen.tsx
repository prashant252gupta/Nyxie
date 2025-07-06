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
      <h1 className="font-headline text-9xl font-bold text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.7)]">
        Nyxie
      </h1>
      <p className="font-body text-2xl text-muted-foreground mt-4 tracking-widest">
        talk dirty, undress minds
      </p>
    </div>
  );
}
