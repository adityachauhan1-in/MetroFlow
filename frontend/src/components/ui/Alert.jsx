import React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const variants = {
  error: {
    className: "alert-error",
    icon: AlertCircle,
    aria: "alert",
  },
  success: {
    className: "alert-success",
    icon: CheckCircle2,
    aria: "status",
  },
  warning: {
    className: "alert-warning",
    icon: Info,
    aria: "alert",
  },
};

export default function Alert({ variant = "error", title, children, onDismiss, className = "" }) {
  const config = variants[variant] || variants.error;
  const Icon = config.icon;

  return (
    <div
      role={config.aria}
      className={`alert ${config.className} ${className}`.trim()}
    >
      <Icon className="alert-icon" size={22} aria-hidden />
      <div className="alert-body">
        {title && <p className="alert-title">{title}</p>}
        <p className="alert-message">{children}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="alert-dismiss"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
