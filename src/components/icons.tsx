export const TylerDurdenIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    shapeRendering="crispEdges"
    className={className}
    aria-label="Tyler Durden Icon"
  >
    <rect x="8" y="20" width="48" height="24" rx="4" fill="#FFB6C1" />
    <text
      x="32"
      y="36"
      textAnchor="middle"
      dy=".3em"
      fill="#4A0404"
      fontSize="12"
      fontFamily="'Space Grotesk', sans-serif"
      fontWeight="bold"
    >
      NYXIE
    </text>
  </svg>
);

export const HarleyQuinnIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    shapeRendering="crispEdges"
    className={className}
    aria-label="Harley Quinn Icon"
  >
    <path d="M32 4 L60 32 L32 60 L4 32Z" fill="#000000" />
    <path d="M32 4 L4 32 L32 32 Z" fill="#E62E2E" />
  </svg>
);

export const DeadpoolIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    shapeRendering="crispEdges"
    className={className}
    aria-label="Deadpool Icon"
  >
    <circle cx="32" cy="32" r="28" fill="#A40F0F" />
    <path
      d="M22 22 C18 32, 18 32, 22 42 C30 40, 30 40, 34 32 C30 24, 30 24, 22 22Z"
      fill="#000000"
    />
    <path
      d="M42 22 C46 32, 46 32, 42 42 C34 40, 34 40, 30 32 C34 24, 34 24, 42 22Z"
      fill="#000000"
    />
    <circle cx="26.5" cy="32" r="3" fill="#FFFFFF" />
    <circle cx="37.5" cy="32" r="3" fill="#FFFFFF" />
  </svg>
);
