import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
    const [metrics, setMetrics] = useState({ totalSales: 0, totalRevenue: 0, topProducts: [] });

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/sales/metrics");
                setMetrics(res.data);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    return (
        <div>
            <h3>Dashboard</h3>
            <div className="row">
                <div className="col-md-4">
                    <div className="card p-3 mb-3">
                        <h5>Total ventas</h5>
                        <h2>{metrics.totalSales}</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 mb-3">
                        <h5>Ingresos</h5>
                        <h2>${metrics.totalRevenue}</h2>
                    </div>
                </div>
            </div>

            <div className="card p-3">
                <h5>Top productos</h5>
                <ul>
                    {metrics.topProducts.map(tp => (
                        <li key={tp.productId}>{tp.name} — {tp.qty} vendidos — ${tp.revenue}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
