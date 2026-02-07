import React from "react";
import { Train } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="metro-loading-screen" aria-live="polite" aria-busy="true">
      <div className="metro-loading-bg" aria-hidden="true" />
      <div className="metro-loading-content">
        <div className="metro-loading-icon">
          <Train size={48} strokeWidth={1.5} className="text-metro-primary animate-train-move" />
        </div>
        <p className="metro-loading-text">Loading your journey…</p>
        <div className="metro-loading-track">
          <div className="metro-loading-train" />
        </div>
      </div>
    </div>
  );
}
