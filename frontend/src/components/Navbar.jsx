import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 🌗 Set theme
    document.documentElement.setAttribute('data-theme', theme);

    // 🔐 Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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

        {!isLoggedIn && (
          <>
            <NavLink to="/register" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Register</NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Login</NavLink>
          </>
        )}

        {isLoggedIn && (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Dashboard</NavLink>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* 🌙 Theme toggle (optional) */}
        {/* <button onClick={toggleTheme} className="theme-toggle">Toggle</button> */}
      </div>
    </nav>
  );
}
