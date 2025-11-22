// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, getUserSales } from "../services/userService";
import { Bar } from "react-chartjs-2";
import formatCurrency from "../utils/formatCurrency";

export default function UserProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [salesPage, setSalesPage] = useState(1);
    const [salesData, setSalesData] = useState({ sales: [], page: 1, total: 0, limit: 20 });

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await getUserProfile(id);
            setProfile(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadSales = async (page = 1) => {
        try {
            const res = await getUserSales(id, { page, limit: 10 });
            setSalesData(res);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadProfile();
        loadSales(salesPage);
        // eslint-disable-next-line
    }, [id]);

    useEffect(() => { loadSales(salesPage); }, [salesPage]);

    if (loading || !profile) return <p>Cargando perfil...</p>;

    const { user, stats, recentSales, byMonth } = profile;

    // prepare chart data (last 12 months)
    const labels = [];
    const values = [];
    if (byMonth && byMonth.length > 0) {
        byMonth.forEach(b => {
            labels.push(`${b._id.month}/${b._id.year}`);
            values.push(b.total);
        });
    }

    const chartData = {
        labels,
        datasets: [
            {
                label: "Gasto por periodo",
                data: values,
                // colors will be default
            }
        ]
    };

    return (
        <div>
            <h3>Perfil de usuario</h3>

            <div className="card p-3 mb-3 shadow-sm">
                <div className="row align-items-center">
                    <div className="col-md-2">
                        <img src={user.avatar || "https://via.placeholder.com/120"} alt="avatar" className="img-fluid rounded" />
                    </div>
                    <div className="col-md-8">
                        <h4>{user.name}</h4>
                        <p className="mb-1"><strong>Email:</strong> {user.email || "—"}</p>
                        <p className="mb-1"><strong>Rol:</strong> {user.role}</p>
                        <p className="mb-1"><strong>Estado:</strong> {user.status}</p>
                        <p className="mb-1"><strong>Registrado:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                        <p className="mb-1"><strong>Último login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—"}</p>
                    </div>
                    <div className="col-md-2 text-end">
                        <div className="mb-2"><strong>Total compras</strong><div>{stats.totalCompras || 0}</div></div>
                        <div><strong>Total gastado</strong><div>{formatCurrency(stats.totalGastado || 0)}</div></div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                        <h5>Gasto por periodo</h5>
                        {labels.length === 0 ? <p className="text-muted">No hay datos para mostrar</p> : <Bar data={chartData} />}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                        <h5>Compras recientes</h5>
                        {recentSales.length === 0 ? <p className="text-muted">Sin compras</p> : (
                            <ul className="list-group" style={{ maxHeight: 360, overflowY: "auto" }}>
                                {recentSales.map(s => (
                                    <li key={s._id} className="list-group-item">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>{new Date(s.createdAt).toLocaleString()}</strong>
                                                <div className="small text-muted">Items: {s.items.length}</div>
                                            </div>
                                            <div>{formatCurrency(s.total)}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* paginated sales table */}
            <div className="card p-3 shadow-sm mt-3">
                <h5>Historial de ventas (paginado)</h5>
                {salesData.sales.length === 0 ? <p className="text-muted">No hay ventas en esta página.</p> : (
                    <div className="table-responsive">
                        <table className="table table-sm table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.sales.map(s => (
                                    <tr key={s._id}>
                                        <td>{new Date(s.createdAt).toLocaleString()}</td>
                                        <td>
                                            <ul className="mb-0">
                                                {s.items.map(it => <li key={it._id}>{it.productId?.name || it.productId} x {it.quantity}</li>)}
                                            </ul>
                                        </td>
                                        <td>{formatCurrency(s.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-2">
                    <div>Page {salesData.page} / {Math.ceil(salesData.total / salesData.limit)}</div>
                    <div>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setSalesPage(p => Math.max(1, p - 1))}>Anterior</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setSalesPage(p => p + 1)}>Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
