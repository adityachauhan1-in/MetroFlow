import React from "react";
export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border-2 border-slate-200/80 bg-white shadow-md hover:shadow-lg transition-shadow ${className}`.trim()}>
      {children}
    </div>
  );
}
    export function CardContent({ children }) {
        return <div className="p-6">{children}</div>;
        }