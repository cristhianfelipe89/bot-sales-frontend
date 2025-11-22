import React, { useEffect, useState } from "react";
import api from "../services/api";
import CategoryForm from "../components/CategoryForm";
import Swal from "sweetalert2";

export default function Categories() {
    const [cats, setCats] = useState([]);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editingId, setEditingId] = useState(null);

    const load = async () => {
        try {
            const res = await api.get("/categories");
            setCats(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudieron cargar las categorías", "error");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!editingId) {
                await api.post("/categories", form);
                Swal.fire("Éxito", "Categoría creada correctamente", "success");
            } else {
                await api.put(`/categories/${editingId}`, form);
                Swal.fire("Actualizada", "Categoría modificada correctamente", "success");
            }

            setForm({ name: "", description: "" });
            setEditingId(null);
            load();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.msg || "Error al guardar", "error");
        }
    };

    const handleEdit = (cat) => {
        setForm({ name: cat.name, description: cat.description });
        setEditingId(cat._id);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar categoría?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/categories/${id}`);
            Swal.fire("Eliminada", "Categoría eliminada", "success");
            load();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.msg || "Error al eliminar", "error");
        }
    };

    return (
        <div>
            <h2 className="mb-4">Categorías</h2>

            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm p-3 mb-4">
                        <h5>{editingId ? "Editar categoría" : "Crear categoría"}</h5>

                        <CategoryForm
                            form={form}
                            setForm={setForm}
                            onSubmit={handleSubmit}
                            editing={!!editingId}
                        />

                        {editingId && (
                            <button
                                className="btn btn-secondary mt-2 w-100"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({ name: "", description: "" });
                                }}
                            >
                                Cancelar edición
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm p-3">
                        <h5 className="mb-3">Lista de categorías</h5>

                        {cats.length === 0 ? (
                            <p className="text-muted">No hay categorías registradas.</p>
                        ) : (
                            <ul className="list-group">
                                {cats.map((c) => (
                                    <li
                                        key={c._id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <strong>{c.name}</strong>
                                            <br />
                                            <small className="text-muted">
                                                {c.description}
                                            </small>
                                        </div>

                                        <div>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEdit(c)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(c._id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
