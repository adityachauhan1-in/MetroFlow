import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { LogOut, User, ArrowLeft } from "lucide-react";
import React from "react";

export default function DashboardLayout({ children, title, backHref, backLabel = "Dashboard" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
     <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
        {backHref && (
              <button
                type="button"
                onClick={() => navigate(backHref)}
                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft size={18} /> {backLabel}
              </button>
            )}
            <h1 className="text-xl font-semibold text-slate-900">
             {title ?? "Metrio"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
           <span className="flex items-center gap-2 text-sm text-slate-600">
              <User size={18} />
              {user?.role === "admin" ? "Admin" : "User"}
        </span>
            <Button variant="outline" className="flex gap-2" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
