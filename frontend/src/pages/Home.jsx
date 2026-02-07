import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Train, Ticket, ArrowRight } from "lucide-react";
import React from "react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role === "admin") return <Navigate to="/admin" replace />;
  if (isAuthenticated && user?.role === "user") return <Navigate to="/user" replace />;

  return (
    <div className="min-h-screen metro-landing">
      <div className="metro-landing-bg" aria-hidden="true" />
      <header className="metro-landing-header">
        <div className="metro-landing-logo">
          <Train size={32} className="text-metro-primary" />
          <span>MetroFlow</span>
        </div>
        <nav className="metro-landing-nav">
          <Link to="/login" className="metro-landing-link">Log in</Link>
          <Link to="/signup" className="metro-landing-cta">Sign up</Link>
        </nav>
      </header>
      <main className="metro-landing-main">
        <h1 className="metro-landing-title">
          Book metro tickets.<br />Travel smart.
        </h1>
        <p className="metro-landing-subtitle">
          Choose your route, check fares, and book in seconds. No queues, no hassle.
        </p>
        <div className="metro-landing-actions">
          <Link to="/signup" className="metro-landing-btn-primary">
            Get started <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="metro-landing-btn-secondary">
            I have an account
          </Link>
        </div>
        <div className="metro-landing-features">
          <div className="metro-landing-feature">
            <Ticket size={24} className="text-metro-primary" />
            <span>Instant booking</span>
          </div>
          <div className="metro-landing-feature">
            <Train size={24} className="text-metro-primary" />
            <span>Fare preview</span>
          </div>
        </div>
      </main>
    </div>
  );
}
