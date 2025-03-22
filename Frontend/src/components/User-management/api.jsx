import axios from "axios";
// const API_URL = "https://twod-tutorial-web-application-3brq.onrender.com";
// const API_URL = "https://twod-tutorial-web-application-3brq.onrender.com" || "http://localhost:6001";
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:6001" // Local server
    : "https://twod-tutorial-web-application-3brq.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
