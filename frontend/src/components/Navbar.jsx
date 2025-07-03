import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import './Navbar.css';

export default function Navbar() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo"><h1>QuoteVerse</h1></NavLink>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
        <NavLink to="/quotes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Quotes</NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Register</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Login</NavLink>
        <button onClick={toggleTheme} className="theme-btn">
          {theme === 'light' ? '🌙 Dark' : '🌞 Light'}
        </button>
      </div>
    </nav>
  );
}
