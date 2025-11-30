// src/services/api.js
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: BASE, withCredentials: true });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (!config.headers["x-request-source"]) config.headers["x-request-source"] = "web";
    return config;
});
export default api;
