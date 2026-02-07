import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { LogOut, ArrowLeft, ChevronDown, User } from "lucide-react";
import React from "react";

function Avatar({ name }) {
  const initial = name ? String(name).trim().charAt(0).toUpperCase() : "?";
  const showIcon = !initial || initial === "?";
  return (
    <div
      className="metro-avatar"
      aria-hidden
    >
      {showIcon ? <User size={20} strokeWidth={2.5} className="text-white" /> : <span className="metro-avatar-initial">{initial}</span>}
    </div>
  );
}

export default function DashboardLayout({ children, title, backHref, backLabel = "Dashboard" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.name || (user?.role === "admin" ? "Admin" : "User");
  const roleLabel = user?.role === "admin" ? "Admin" : "User";

  return (
    <div className="min-h-screen metro-dashboard-bg">
      <header className="metro-dashboard-header">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            {backHref && (
              <button
                type="button"
                onClick={() => navigate(backHref)}
                className="metro-dashboard-back"
              >
                <ArrowLeft size={18} strokeWidth={2.5} className="shrink-0 text-white" /> {backLabel}
              </button>
            )}
            <h1 className="text-xl font-bold text-white">
              {title ?? "MetroFlow"}
            </h1>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="metro-dashboard-profile-trigger"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <Avatar name={displayName} />
              <span className="hidden text-sm font-semibold text-slate-800 sm:inline">{displayName}</span>
              <ChevronDown size={18} strokeWidth={2.5} className="shrink-0 text-slate-600" />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden="true"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="metro-dashboard-dropdown">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={displayName} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                        {user?.email && (
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                        )}
                        <p className="text-xs font-semibold capitalize text-metro-dark">{roleLabel}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1">
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} strokeWidth={2.5} className="shrink-0 text-slate-600" /> Logout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
