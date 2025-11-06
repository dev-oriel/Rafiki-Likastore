import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  // Get user from local storage
  const userItem = localStorage.getItem("rafiki_user");

  if (userItem) {
    const { token } = JSON.parse(userItem);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
