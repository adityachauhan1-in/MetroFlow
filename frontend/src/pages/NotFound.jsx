import { Link } from "react-router-dom";
import { Train, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="metro-notfound">
      <div className="metro-notfound-bg" aria-hidden="true" />
      <div className="metro-notfound-content">
        <Train size={64} className="metro-notfound-icon" />
        <h1 className="metro-notfound-title">Page not found</h1>
        <p className="metro-notfound-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="metro-notfound-btn">
          <Home size={20} /> Go home
        </Link>
      </div>
    </div>
  );
}
