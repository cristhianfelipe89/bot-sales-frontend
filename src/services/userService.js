// src/services/userService.js
import api from "./api";

export const listUsers = () => api.get("/users").then(r => r.data);
export const getUserStats = () => api.get("/users/stats").then(r => r.data);
export const getUserProfile = (id) => api.get(`/users/${id}/profile`).then(r => r.data);
export const getUserSales = (id, params) => api.get(`/users/${id}/sales`, { params }).then(r => r.data);
export const getUserLogs = (id) => api.get(`/users/${id}/logs`).then(r => r.data); // NUEVO
export const createUser = (payload) => api.post("/users", payload).then(r => r.data);
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload).then(r => r.data);
export const changeUserStatus = (id, status) => api.patch(`/users/${id}/status`, { status }).then(r => r.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then(r => r.data);
