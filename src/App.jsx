import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

export default function App() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand">BotSales Admin</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item"><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                            <li className="nav-item"><Link to="/products" className="nav-link">Productos</Link></li>
                            <li className="nav-item"><Link to="/sales" className="nav-link">Ventas</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/sales" element={<Sales />} />
                </Routes>
            </div>
        </div>
    );
}
