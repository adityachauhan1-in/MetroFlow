import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

/**
 * "/" redirects to /login, /user, or /admin based on auth and role.
 */
export default function Home() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/user" replace />;
}
