// src/components/Shared/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Chargement...</p>
    </div>
  );
};

export default LoadingSpinner;
