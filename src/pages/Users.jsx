// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { listUsers, getUserStats, changeUserStatus, deleteUser } from "../services/userService";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const load = async () => {
        try {
            const data = await listUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudieron cargar usuarios", "error");
        }
    };

    useEffect(() => { load(); }, []);

    const handleToggleStatus = async (user) => {
        const next = user.status === "active" ? "suspended" : "active";
        const confirm = await Swal.fire({
            title: `¿Cambiar estado a ${next}?`,
            text: `${user.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar"
        });
        if (!confirm.isConfirmed) return;
        try {
            await changeUserStatus(user._id, next);
            Swal.fire("Hecho", "Estado actualizado", "success");
            load();
        } catch (err) {
            Swal.fire("Error", "No se pudo cambiar estado", "error");
        }
    };

    const handleDelete = async (user) => {
        const confirm = await Swal.fire({
            title: `Eliminar ${user.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar"
        });
        if (!confirm.isConfirmed) return;
        try {
            await deleteUser(user._id);
            Swal.fire("Eliminado", "Usuario eliminado", "success");
            load();
        } catch (err) {
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };

    const merged = users; // we could merge stats if needed

    const filtered = merged.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = u.name.toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
        const matchRole = filterRole ? u.role === filterRole : true;
        return matchSearch && matchRole;
    });

    const sorted = [...filtered].sort((a, b) => {
        const v1 = (a[sortField] ?? "").toString().toLowerCase();
        const v2 = (b[sortField] ?? "").toString().toLowerCase();
        if (v1 === v2) return 0;
        return sortOrder === "asc" ? (v1 > v2 ? 1 : -1) : (v1 < v2 ? 1 : -1);
    });

    const exportExcel = () => {
        const data = sorted.map(u => ({
            Nombre: u.name,
            Email: u.email,
            Rol: u.role,
            Estado: u.status,
            "Fecha registro": new Date(u.createdAt).toLocaleString()
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        XLSX.writeFile(wb, "usuarios.xlsx");
    };

    return (
        <div>
            <h3>Usuarios</h3>

            <div className="card shadow-sm p-3 mb-3">
                <div className="row g-2 align-items-center">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={sortField} onChange={e => setSortField(e.target.value)}>
                            <option value="name">Nombre</option>
                            <option value="email">Email</option>
                            <option value="createdAt">Fecha registro</option>
                        </select>
                    </div>
                    <div className="col-md-2 text-end">
                        <button className="btn btn-outline-secondary me-2" onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}</button>
                        <button className="btn btn-success" onClick={exportExcel}>Exportar</button>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm p-3">
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr><td colSpan="7" className="text-center text-muted">No hay usuarios</td></tr>
                            ) : sorted.map((u, i) => (
                                <tr key={u._id}>
                                    <td>{i + 1}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className={`badge bg-${u.role === "admin" ? "primary" : "secondary"}`}>{u.role}</span></td>
                                    <td><span className={`badge ${u.status === "active" ? "bg-success" : "bg-warning text-dark"}`}>{u.status}</span></td>
                                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link to={`/users/${u._id}/profile`} className="btn btn-sm btn-info">Perfil</Link>
                                            <button className="btn btn-sm btn-outline-warning" onClick={() => handleToggleStatus(u)}>{u.status === "active" ? "Suspender" : "Reactivar"}</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u)}>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
