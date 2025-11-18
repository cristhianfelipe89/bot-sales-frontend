import api from './api';

export const listCategories = () => api.get('/categories').then(r => r.data);
export const createCategory = (payload) => api.post('/categories', payload).then(r => r.data);
