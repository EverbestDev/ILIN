// src/components/LoadingSpinner.jsx
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div
      className="flex items-center justify-center p-4"
      aria-label="Loading content"
      role="status"
    >
      {/* Loader2 is the lucide-react spinner icon */}
      <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
