import React, { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import formatCurrency from '../utils/formatCurrency';

export default function MetricsChart() {
    const { metrics, loading } = useContext(DashboardContext);

    if (loading) return <p>Cargando métricas...</p>;

    return (
        <div className="row mb-3">
            <div className="col-md-4">
                <div className="card p-3">
                    <h6>Total ventas</h6>
                    <h3>{metrics.totalSales}</h3>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card p-3">
                    <h6>Ingresos</h6>
                    <h3>{formatCurrency(metrics.totalRevenue)}</h3>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card p-3">
                    <h6>Top productos</h6>
                    <ul className="mb-0">
                        {metrics.topProducts?.map(tp => (
                            <li key={tp.productId}>{tp.name} — {tp.qty}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
