import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function NavBar() {
    const { authState, handleLogout } = useContext(AuthContext);

    if (!authState?.user) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">

                <Link className="navbar-brand" to="/dashboard">BotSales Admin</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/products">Productos</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/categories">Categorías</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/sales">Ventas</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/conversations">Conversaciones</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/users">Usuarios</Link>
                        </li>

                    </ul>

                    <span className="navbar-text me-3">
                        {authState.user.name} ({authState.user.role})
                    </span>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>
            </div>
        </nav>
    );
}
