import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Alert from "../components/ui/Alert";

export default function SignUp() {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, logout, isTokenValid } = useAuth();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Only clear expired tokens, don't redirect automatically
    // Allow users to access signup page even when logged in (to create new account)
    useEffect(() => {
        if (token && !isTokenValid(token)) {
            // Token expired, clear it
            logout();
        }
    }, [token, isTokenValid, logout]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/user/signup", formData);
            if (res.data?.message === "User created successfully") {
                navigate("/login", { replace: true, state: { fromSignup: true } });
            } else {
                setError(res.data?.message || "Sign up completed. Please log in.");
                setLoading(false);
            }
        } catch (err) {
            const msg = err.response?.data?.message ?? err.response?.data?.err ?? "Sign up failed. Try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Join MetroFlow — book metro tickets and travel smart</p>

                {error && (
                    <Alert variant="error" onDismiss={() => setError("")}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <label className="auth-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="auth-input"
                        autoComplete="name"
                    />
                    <label className="auth-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="auth-input"
                        autoComplete="email"
                    />
                    <label className="auth-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="auth-input"
                        autoComplete="new-password"
                        minLength={6}
                    />
                    <button type="submit" disabled={loading} className="auth-button">
                        {loading && <span className="loading-spinner" />}
                        {loading ? "Creating account…" : "Sign up"}
                    </button>
                </form>


                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">Log in</Link>
                </p>
            </div>
        </div>
    );
}