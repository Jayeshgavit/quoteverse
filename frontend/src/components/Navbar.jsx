import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
    }
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
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
            {userRole === 'admin' ? (
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Admin Dashboard
              </NavLink>
            ) : (
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Dashboard
              </NavLink>
            )}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
