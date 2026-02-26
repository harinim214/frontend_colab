import { Link, useLocation } from "react-router-dom";
import "../styles/layout.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="logo">CollabShare</h2>

      <nav>
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>
      </nav>
    </div>
  );
}