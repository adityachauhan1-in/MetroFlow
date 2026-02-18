import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:border-sky-200 transition-all ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`.trim()}>{children}</div>;
}