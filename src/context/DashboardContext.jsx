import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    const [metrics, setMetrics] = useState({ totalSales: 0, totalRevenue: 0, topProducts: [] });
    const [loading, setLoading] = useState(false);

    const loadMetrics = async () => {
        setLoading(true);
        try {
            const res = await api.get('/sales/metrics');
            setMetrics(res.data);
        } catch (err) {
            console.error('Error loading metrics', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    return (
        <DashboardContext.Provider value={{ metrics, loadMetrics, loading }}>
            {children}
        </DashboardContext.Provider>
    );
}
