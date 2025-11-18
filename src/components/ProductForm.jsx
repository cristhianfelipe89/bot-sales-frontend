import React from 'react';

export default function ProductForm({ form, setForm, onSubmit }) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-2">
                <input className="form-control" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-2">
                <input className="form-control" placeholder="Categoría" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="mb-2 row">
                <div className="col">
                    <input className="form-control" placeholder="Precio" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
                <div className="col">
                    <input className="form-control" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} required />
                </div>
            </div>
            <div className="mb-2">
                <textarea className="form-control" placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button className="btn btn-success">Guardar</button>
        </form>
    );
}
