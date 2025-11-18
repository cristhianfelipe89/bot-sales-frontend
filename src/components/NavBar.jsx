import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
    const { user, logout } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">BotSales Admin</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/products">Productos</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/categories">Categorías</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/sales">Ventas</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/conversations">Conversaciones</Link></li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item"><span className="nav-link">Admin</span></li>
                                <li className="nav-item"><button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Cerrar sesión</button></li>
                            </>
                        ) : (
                            <li className="nav-item"><Link className="nav-link" to="/">Iniciar sesión</Link></li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
