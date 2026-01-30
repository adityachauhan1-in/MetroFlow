import React from "react";

export default function Button({ children, onClick, variant = "primary", className = "", type = "button", ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium transition inline-flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-800",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}