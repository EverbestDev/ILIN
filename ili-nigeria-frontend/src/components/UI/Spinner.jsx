import React from "react";
import "../../index.css";

const sizeMap = {
  xs: "ili-spinner--xs",
  sm: "ili-spinner--sm",
  md: "ili-spinner--md",
  lg: "ili-spinner--lg",
};

export default function Spinner({
  size = "md",
  className = "",
  color,
  overlay = false,
}) {
  const sizeClass = sizeMap[size] || sizeMap.md;
  const style = color ? { ["--spinner-color"]: color } : undefined;

  const spinner = (
    <div
      className={`ili-spinner ${sizeClass} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    >
      {/* accessible text for screen readers */}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (!overlay) return spinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="p-6 bg-white rounded-lg shadow-xl">{spinner}</div>
    </div>
  );
}
