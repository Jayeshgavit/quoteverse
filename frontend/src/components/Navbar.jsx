import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
      <h1>QuoteVerse</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <button onClick={toggleTheme} className="theme-btn">
          {theme === 'light' ? '🌙 Dark' : '🌞 Light'}
        </button>
      </div>
    </nav>
  );
}
