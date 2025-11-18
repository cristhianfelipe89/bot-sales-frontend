import React from 'react';

export default function CategoryForm({ form, setForm, onSubmit }) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-2">
                <input className="form-control" placeholder="Nombre categoría" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-2">
                <textarea className="form-control" placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button className="btn btn-primary">Crear categoría</button>
        </form>
    );
}
