import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:2200/api/auth/login', {
        email: form.email,
        password: form.password,
      });

      const token = res.data.token;
      localStorage.setItem('token', token);

      // ✅ Decode token to extract role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      console.log('🔑 JWT Payload:', payload);
      console.log('👤 Logged in role:', role);

      setMessage(`✅ Login successful! Redirecting as ${role}...`);
      setForm({ email: '', password: '' });

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      setMessage('❌ Login failed. ' + (err.response?.data?.message || 'Please try again.'));
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
        Don’t have an account?{' '}
        <span onClick={() => navigate('/register')} className="register-link">
          Register now
        </span>
      </p>
    </div>
  );
}
