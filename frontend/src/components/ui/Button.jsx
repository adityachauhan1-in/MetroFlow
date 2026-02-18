import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-sky-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-sky-500",
    outline:
      "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-sky-300",
  };

  const variantClasses = styles[variant] ?? styles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variantClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}