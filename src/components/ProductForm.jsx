// src/components/ProductForm.jsx
import React from "react";

export default function ProductForm({
    form,
    setForm,
    onSubmit,
    editing,
    categories
}) {
    const noCategories = !categories || categories.length === 0;

    return (
        <form onSubmit={onSubmit} className="mt-3">

            {/* Nombre */}
            <div className="mb-3">
                <label className="form-label">Nombre del producto</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Café Premium"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>

            {/* Categoría */}
            <div className="mb-3">
                <label className="form-label">Categoría</label>

                {noCategories ? (
                    <div className="alert alert-warning p-2">
                        No hay categorías creadas.
                        <strong>Debe crear al menos una categoría primero.</strong>
                    </div>
                ) : null}

                <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    disabled={noCategories}
                    required
                >
                    <option value="">Seleccione una categoría</option>
                    {categories.map((c) => (
                        <option key={c._id} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Precio y Stock */}
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: Number(e.target.value) })
                        }
                        required
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={form.stock}
                        onChange={(e) =>
                            setForm({ ...form, stock: Number(e.target.value) })
                        }
                        required
                    />
                </div>
            </div>

            {/* Descripción */}
            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                    className="form-control"
                    placeholder="Ej: Café recién tostado de origen colombiano"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>

            {/* Botón guardar */}
            <button
                className="btn btn-success w-100"
                disabled={noCategories}
            >
                {editing ? "Actualizar producto" : "Guardar producto"}
            </button>
        </form>
    );
}
