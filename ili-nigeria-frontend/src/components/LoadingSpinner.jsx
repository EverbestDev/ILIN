// src/components/LoadingSpinner.jsx
import React from "react";
import Spinner from "./UI/Spinner";

const LoadingSpinner = ({ size = "lg" }) => {
  return (
    <div className="flex items-center justify-center p-4" aria-label="Loading content" role="status">
      <Spinner size={size} />
    </div>
  );
};

export default LoadingSpinner;
