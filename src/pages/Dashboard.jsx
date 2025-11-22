// src/pages/Dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import formatCurrency from "../utils/formatCurrency";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [salesMetrics, setSalesMetrics] = useState({
        totalSales: 0,
        totalRevenue: 0,
        topProducts: []
    });
    const [productMetrics, setProductMetrics] = useState({
        totalProducts: 0,
        lowStock: [],
        outOfStock: []
    });
    const [error, setError] = useState(null);

    // Polling control
    const timerRef = useRef(null);
    const intervalRef = useRef(60000); // normal interval (60s) - you chose B
    const errorBackoffRef = useRef(120000); // backoff interval (120s)
    const isPausedRef = useRef(false);
    const mountedRef = useRef(true);

    // load metrics once
    const loadAllMetrics = async () => {
        setError(null);
        try {
            const [salesRes, prodRes] = await Promise.all([
                api.get("/sales/metrics"),
                api.get("/products/metrics")
            ]);

            if (!mountedRef.current) return;

            setSalesMetrics({
                totalSales: salesRes.data.totalSales ?? 0,
                totalRevenue: salesRes.data.totalRevenue ?? 0,
                topProducts: salesRes.data.topProducts ?? []
            });

            setProductMetrics({
                totalProducts: prodRes.data.totalProducts ?? 0,
                lowStock: prodRes.data.lowStock ?? [],
                outOfStock: prodRes.data.outOfStock ?? []
            });

            // if success and we were using backoff, restore normal interval
            intervalRef.current = 60000;
        } catch (err) {
            console.error("Error cargando métricas:", err);
            setError(err.response?.data?.msg || err.message || "Error al cargar métricas");
            // set backoff interval on error
            intervalRef.current = errorBackoffRef.current;
        } finally {
            setLoading(false);
        }
    };

    // start polling loop (uses intervalRef.current and respects isPausedRef)
    const startPolling = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const run = async () => {
            if (isPausedRef.current || !mountedRef.current) {
                // schedule next check when not paused
                timerRef.current = setTimeout(run, 1000);
                return;
            }
            await loadAllMetrics();
            // schedule next run using current interval (which may be backoff)
            timerRef.current = setTimeout(run, intervalRef.current);
        };
        // initial schedule
        timerRef.current = setTimeout(run, 0);
    };

    const stopPolling = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // visibility handlers: pause when tab hidden, resume when visible
    useEffect(() => {
        mountedRef.current = true;
        // initial load + start polling
        startPolling();

        const handleVisibility = () => {
            if (document.hidden) {
                isPausedRef.current = true;
                stopPolling();
                console.log("Dashboard polling paused (tab hidden).");
            } else {
                isPausedRef.current = false;
                console.log("Dashboard polling resumed (tab visible).");
                // resume immediately
                startPolling();
            }
        };

        const handleFocus = () => {
            if (!isPausedRef.current) return;
            isPausedRef.current = false;
            startPolling();
        };

        const handleBlur = () => {
            // optional: pause on window blur to reduce work
            isPausedRef.current = true;
            stopPolling();
        };

        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            mountedRef.current = false;
            stopPolling();
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // EXPORT functions
    const exportSalesToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            (salesMetrics.topProducts || []).map((p, i) => ({
                rank: i + 1,
                productId: p.productId,
                name: p.name,
                qty: p.qty,
                revenue: p.revenue
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TopProductos");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf], { type: "application/octet-stream" }), "top_products.xlsx");
    };

    const exportInventoryToExcel = () => {
        const rows = [
            ...(productMetrics.lowStock || []).map(p => ({ status: "Bajo stock", name: p.name, category: p.category, stock: p.stock })),
            ...(productMetrics.outOfStock || []).map(p => ({ status: "Agotado", name: p.name, category: p.category, stock: p.stock }))
        ];
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "InventarioCritico");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf], { type: "application/octet-stream" }), "inventario_critico.xlsx");
    };

    // UI
    if (loading) return <p>Cargando métricas...</p>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div>
            <h2>Dashboard</h2>

            {/* TOP METRICS CARDS (arriba) */}
            <div className="row g-3 mt-3">
                <div className="col-md-3">
                    <div className="card shadow-sm p-3">
                        <h6>Total ventas</h6>
                        <h3>{salesMetrics.totalSales}</h3>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm p-3">
                        <h6>Ingresos</h6>
                        <h3>{formatCurrency(salesMetrics.totalRevenue)}</h3>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm p-3">
                        <h6>Top productos</h6>
                        <h3>{(salesMetrics.topProducts || []).length}</h3>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm p-3">
                        <h6>Total productos</h6>
                        <h3>{productMetrics.totalProducts}</h3>
                    </div>
                </div>
            </div>

            {/* SECOND ROW: Top products left, controls right */}
            <div className="row mt-4 g-3">
                <div className="col-md-6">
                    <div className="card shadow-sm p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start">
                            <h5>Top productos</h5>
                            <div>
                                <button className="btn btn-sm btn-outline-success me-2" onClick={exportSalesToExcel}>Exportar Top</button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => { loadAllMetrics(); }}>Actualizar</button>
                            </div>
                        </div>

                        {(!salesMetrics.topProducts || salesMetrics.topProducts.length === 0) ? (
                            <p className="text-muted mt-3">No hay ventas registradas aún.</p>
                        ) : (
                            <ul className="list-group mt-3" style={{ maxHeight: 360, overflowY: "auto" }}>
                                {salesMetrics.topProducts.map((p, i) => (
                                    <li key={p.productId || i} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{i + 1}. {p.name}</strong>
                                            <div className="small text-muted">Vendidos: {p.qty}</div>
                                        </div>
                                        <div className="text-end">
                                            <div>{formatCurrency(p.revenue)}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start">
                            <h5>Acciones</h5>
                            <div>
                                <button className="btn btn-sm btn-outline-success me-2" onClick={exportInventoryToExcel}>Exportar Inventario</button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => { loadAllMetrics(); }}>Actualizar</button>
                            </div>
                        </div>

                        <div className="mt-3">
                            <p className="small text-muted">Última actualización cada 60s (pausa si la pestaña está inactiva).</p>
                            <p className="small text-muted">Si ocurre un error, el polling reduce frecuencia a 120s y reintentará.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INVENTORY SECTION (below) */}
            <div className="row mt-4 g-3">
                <div className="col-12">
                    <div className="card shadow-sm p-3">
                        <h5>Inventario crítico</h5>

                        <div className="row mt-3">
                            <div className="col-md-6 mb-3">
                                <div className="card p-3 h-100">
                                    <h6 className="mb-2">Productos con bajo stock <small className="text-muted">({productMetrics.lowStock.length})</small></h6>
                                    {productMetrics.lowStock.length === 0 ? (
                                        <p className="text-muted">No hay productos con bajo stock.</p>
                                    ) : (
                                        <ul className="list-group" style={{ maxHeight: 300, overflowY: "auto" }}>
                                            {productMetrics.lowStock.map(p => (
                                                <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>{p.name}</strong>
                                                        <div className="small text-muted">{p.category}</div>
                                                    </div>
                                                    <span className="badge bg-warning text-dark">Stock: {p.stock}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <div className="card p-3 h-100">
                                    <h6 className="mb-2">Productos agotados <small className="text-muted">({productMetrics.outOfStock.length})</small></h6>
                                    {productMetrics.outOfStock.length === 0 ? (
                                        <p className="text-muted">No hay productos agotados.</p>
                                    ) : (
                                        <ul className="list-group" style={{ maxHeight: 300, overflowY: "auto" }}>
                                            {productMetrics.outOfStock.map(p => (
                                                <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>{p.name}</strong>
                                                        <div className="small text-muted">{p.category}</div>
                                                    </div>
                                                    <span className="badge bg-danger">0</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
