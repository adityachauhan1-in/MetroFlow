import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, token, isAuthenticated, logout, isTokenValid } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fromSignup = location.state?.fromSignup;

    // Only clear expired tokens, don't redirect automatically
    // Allow users to access login page even when logged in (to switch accounts)
    useEffect(() => {
        if (token && !isTokenValid(token)) {
            // Token expired, clear it
            logout();
        }
    }, [token, isTokenValid, logout]);

    const handleLogin = async (e) => {
        e?.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success && result.user) {
                // Redirect based on user role after successful login
                const userRole = result.user.role;
                if (userRole === "admin") {
                    navigate("/admin", { replace: true });
                } else {
                    navigate("/user", { replace: true });
                }
            } else {
                setError(result.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Log in</h1>
                <p className="auth-subtitle">
                    {fromSignup ? "Account created. Sign in to continue." : "Sign in to your Metrio account"}
                </p>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="auth-form">
                    <label htmlFor="login-email" className="auth-label">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="auth-input"
                        autoComplete="email"
                    />
                    <label htmlFor="login-password" className="auth-label">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="auth-input"
                        autoComplete="current-password"
                    />
                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? "Signing in…" : "Log in"}
                    </button>
                </form>

           

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/signup" className="auth-link">Sign up</Link>
                </p>
            </div>
        </div>
    );
}