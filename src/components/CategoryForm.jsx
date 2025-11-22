import React from "react";

export default function CategoryForm({ form, setForm, onSubmit, editing }) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label className="form-label">Nombre categoría</label>
                <input
                    className="form-control"
                    placeholder="Ej: Bebidas"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                    className="form-control"
                    placeholder="Descripción opcional"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>

            <button className="btn btn-primary w-100">
                {editing ? "Actualizar categoría" : "Crear categoría"}
            </button>
        </form>
    );
}

