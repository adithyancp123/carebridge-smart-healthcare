import axios from 'axios';

// Use the VITE_API_URL environment variable if provided, otherwise default to relative path (which Vite proxies)
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
});

export default api;
