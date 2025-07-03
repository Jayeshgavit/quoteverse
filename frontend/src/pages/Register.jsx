import { useState } from 'react';
import axios from 'axios';
import './Register.css'; // 🌈 Updated with theme-aware styles

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage('❌ Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:2200/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setMessage('✅ Registered successfully!');
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setMessage('❌ Registration failed. ' + (err.response?.data?.message || 'Try again.'));
    }
  };

  return (
    <div className="register-container">
      <h2>🌟 Create Your QuoteVerse Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
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
        <button type="submit">Register</button>
      </form>
      {message && <p className="register-message">{message}</p>}
    </div>
  );
}
