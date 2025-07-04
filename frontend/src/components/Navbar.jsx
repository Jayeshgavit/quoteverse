import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Detect route changes

  // 🔄 Update on route change (login, logout, refresh)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location.pathname]); // ✅ Re-check on every page change

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo"><h1>QuoteVerse</h1></NavLink>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
        <NavLink to="/quotes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Quotes</NavLink>

        {!isLoggedIn ? (
          <>
            <NavLink to="/register" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Register</NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Login</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Dashboard</NavLink>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
