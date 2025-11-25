import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, getUserSales, getUserLogs } from "../services/userService";
import { Bar } from "react-chartjs-2";
import formatCurrency from "../utils/formatCurrency";
import { formatDateCol } from "../utils/formatDate"; // Importar utilidad

export default function UserProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [salesPage, setSalesPage] = useState(1);
    const [salesData, setSalesData] = useState({ sales: [], page: 1, total: 0, limit: 20 });
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const p = await getUserProfile(id);
                setProfile(p);
                const l = await getUserLogs(id);
                setLogs(l);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, [id]);

    useEffect(() => {
        getUserSales(id, { page: salesPage, limit: 10 }).then(setSalesData).catch(console.error);
    }, [id, salesPage]);

    if (loading || !profile) return <p className="p-4">Cargando...</p>;

    const { user, stats, byMonth } = profile;
    const labels = byMonth?.map(b => `${b._id.month}/${b._id.year}`) || [];
    const values = byMonth?.map(b => b.total) || [];
    const chartData = { labels, datasets: [{ label: "Gasto", data: values, backgroundColor: '#0d6efd' }] };

    return (
        <div>
            <h3>Perfil de usuario</h3>
            <div className="card p-3 mb-3 shadow-sm">
                <div className="row align-items-center">
                    <div className="col-md-2 text-center">
                        <img src={user.avatar || "https://via.placeholder.com/120"} alt="av" className="img-fluid rounded-circle" style={{maxHeight:100}} />
                    </div>
                    <div className="col-md-8">
                        <h4>{user.name}</h4>
                        <p className="mb-1"><strong>Email:</strong> {user.email || "—"}</p>
                        <p className="mb-1"><strong>Registro:</strong> {formatDateCol(user.createdAt)}</p>
                        <p className="mb-1"><strong>Último login:</strong> {formatDateCol(user.lastLogin)}</p>
                    </div>
                    <div className="col-md-2 text-end">
                        <div><strong>Total Gastado</strong><h3>{formatCurrency(stats.totalGastado || 0)}</h3></div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm h-100">
                        <h5>Gasto histórico</h5>
                        {labels.length === 0 ? <p className="text-muted">Sin datos</p> : <Bar data={chartData} />}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm h-100">
                        <h5>Logs de Actividad</h5>
                        {logs.length === 0 ? <p>Sin registros.</p> : (
                            <div style={{ maxHeight: 300, overflowY: "auto" }}>
                                <table className="table table-sm table-hover small">
                                    <thead><tr><th>Fecha</th><th>Acción</th><th>Detalle</th></tr></thead>
                                    <tbody>
                                        {logs.map(log => (
                                            <tr key={log._id}>
                                                <td>{formatDateCol(log.createdAt)}</td>
                                                <td><span className="badge bg-light text-dark border">{log.action}</span></td>
                                                <td>{log.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card p-3 shadow-sm mt-3">
                <h5>Compras</h5>
                <div className="table-responsive">
                    <table className="table table-sm table-striped">
                        <thead><tr><th>Fecha</th><th>Items</th><th>Total</th></tr></thead>
                        <tbody>
                            {salesData.sales.map(s => (
                                <tr key={s._id}>
                                    <td>{formatDateCol(s.createdAt)}</td>
                                    <td>{s.items.map(i => `${i.quantity}x ${i.productId?.name || '?'}`).join(', ')}</td>
                                    <td>{formatCurrency(s.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Paginación simple */}
                <div className="mt-2">
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => setSalesPage(p=>Math.max(1,p-1))} disabled={salesPage<=1}>Prev</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setSalesPage(p=>p+1)} disabled={salesData.sales.length < salesData.limit}>Next</button>
                </div>
            </div>
        </div>
    );
}