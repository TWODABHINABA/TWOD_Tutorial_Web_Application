import axios from "axios";
const API_URL = "https://twod-tutorial-web-application.onrender.com"; 
// const API_URL = "http://localhost:6001"; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;