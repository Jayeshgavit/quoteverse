import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext); // ✅ Use global login function

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Step 1: Login API
      const res = await axios.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      const token = res.data.token;
      localStorage.setItem('token', token);

      // Step 2: Decode and get role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      localStorage.setItem('role', role);

      // Step 3: Get full user info
      const userRes = await axios.get('/auth/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Step 4: Set context
      login(userRes.data);

      // Step 5: Redirect
      setMessage(`✅ Login successful! Redirecting as ${role}...`);
      setForm({ email: '', password: '' });

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 800);
    } catch (err) {
      console.error('Login error:', err);
      setMessage('❌ Login failed. ' + (err.response?.data?.message || 'Try again.'));
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Welcome Back to QuoteVerse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label className="show-pass">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>
        <button type="submit">Login</button>
      </form>

      {message && <p className="login-message">{message}</p>}

      <p className="login-footer">
        Don’t have an account?
        <span onClick={() => navigate('/register')} className="register-link">
          Register now
        </span>
      </p>
    </div>
  );
}
