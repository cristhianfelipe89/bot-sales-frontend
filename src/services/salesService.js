import api from './api';

export const listSales = () => api.get('/sales').then(r => r.data);
export const createSale = (payload) => api.post('/sales', payload).then(r => r.data);
export const getMetrics = () => api.get('/sales/metrics').then(r => r.data);
