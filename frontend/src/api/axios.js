import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:2200/api', // ✅ backend port is 2200!
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
