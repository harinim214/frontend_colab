import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-user" ref={dropdownRef}>
        <div className="avatar" onClick={() => setOpen(!open)}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <span className="username" onClick={() => setOpen(!open)}>
          {user?.name}
        </span>

        {open && (
          <div className="dropdown">
            <div onClick={() => navigate("/profile")}>Profile</div>
            <div onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}