// src/services/productService.js
import api from "./api";

export const listProducts = (params) => api.get("/products", { params }).then(r => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data);
export const createProduct = (payload) => api.post("/products", payload).then(r => r.data);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload).then(r => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(r => r.data);
export const getProductMetrics = () => api.get("/products/metrics").then(r => r.data);
