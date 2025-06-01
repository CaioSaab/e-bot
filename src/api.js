import Axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const api = Axios.create({
    baseURL: 'https://localhost:7290/api'
})

api.interceptors.request.use((config) => {
  const authToken = window.localStorage.getItem("AUTH_TOKEN");
  const isAuthenticated = Boolean(authToken);

  if (isAuthenticated) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  return config;
});

export default api;