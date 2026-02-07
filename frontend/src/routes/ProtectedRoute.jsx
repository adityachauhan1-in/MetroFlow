import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import LoadingScreen from "../components/ui/LoadingScreen";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { token, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode the token to get user role
        const decoded = jwtDecode(token);
        const userRole = decoded.role;

        // Check if user role is allowed
        if (allowedRoles && !allowedRoles.includes(userRole)) {
            return <Navigate to="/login" replace />;
        }

        // Everything is ok, allow access
        return children;
    } catch (error) {
        // Invalid token, redirect to login
        console.error("Token decode error:", error);
        return <Navigate to="/login" replace />;
    }
}