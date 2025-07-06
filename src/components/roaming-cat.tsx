
"use client";

import React from 'react';

const CatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 5c-2.67 0-5 1.34-5 3v2c0 1.66 2.33 3 5 3s5-1.34 5-3V8c0-1.66-2.33-3-5-3z" />
    <path d="M19 9.5c0 .5-.5 1-1 1s-1-.5-1-1 .5-1 1-1 1 .5 1 1z" />
    <path d="M5 9.5c0 .5-.5 1-1 1s-1-.5-1-1 .5-1 1-1 1 .5 1 1z" />
    <path d="M12 13c-2.76 0-5 2.24-5 5v1h10v-1c0-2.76-2.24-5-5-5z" />
    <path d="M8 18c-1 0-1.5-.5-1.5-1s.5-1 1.5-1" />
    <path d="M16 18c1 0 1.5-.5 1.5-1s-.5-1-1.5-1" />
  </svg>
);


const RoamingCat = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-24 pointer-events-none overflow-x-hidden z-20">
      <div className="absolute bottom-0 animate-roam-cat">
        <CatIcon className="text-foreground opacity-20" />
      </div>
    </div>
  );
};

export default RoamingCat;
