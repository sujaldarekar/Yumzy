import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add Authorization header interceptor to send token with every request
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem('userToken');
    const partnerToken = localStorage.getItem('partnerToken');
    
    const token = userToken || partnerToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
