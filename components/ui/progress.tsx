import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, className = "", ...props }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-900 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-[#00d2ff] transition-all duration-300"
        style={{
          width: `${safeValue}%`,
          boxShadow: safeValue > 0 ? "0 0 8px rgba(0,210,255,0.5)" : "none",
        }}
      />
    </div>
  );
}
