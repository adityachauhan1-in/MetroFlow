import React from "react";

export default function Button({ children, onClick, variant = "primary", className = "", type = "button", ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium transition inline-flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-slate-800 text-white hover:bg-slate-900 border-2 border-slate-800 shadow-md hover:shadow-lg transition-all",
    outline: "border-2 border-slate-400 bg-white text-slate-800 hover:bg-slate-100 hover:border-slate-500",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}