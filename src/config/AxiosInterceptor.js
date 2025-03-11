import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use the environment variable
});

// Add interceptors for handling FormData and JSON requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Dynamically set Content-Type based on data type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add authorization header if token exists
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