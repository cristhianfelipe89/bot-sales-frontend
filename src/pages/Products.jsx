import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", category: "General", price: 0, stock: 0 });
    const [filters, setFilters] = useState({ category: "", search: "", sort: "" });

    const load = async () => {
        try {
            const q = new URLSearchParams();
            if (filters.category) q.set("category", filters.category);
            if (filters.search) q.set("search", filters.search);
            if (filters.sort) q.set("sort", filters.sort);
            const res = await api.get(`/products?${q.toString()}`);
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/products", form);
            setForm({ name: "", description: "", category: "General", price: 0, stock: 0 });
            load();
        } catch (err) { alert(err.response?.data?.msg || "Error crear producto"); }
    };

    const applyFilters = async () => {
        await load();
    };

    return (
        <div>
            <h3>Productos</h3>
            <div className="card p-3 mb-3">
                <h5>Crear producto</h5>
                <form onSubmit={handleCreate}>
                    <input className="form-control my-1" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input className="form-control my-1" placeholder="Categoría" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    <input className="form-control my-1" placeholder="Precio" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                    <input className="form-control my-1" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
                    <textarea className="form-control my-1" placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <button className="btn btn-success my-1">Crear</button>
                </form>
            </div>

            <div className="card p-3 mb-3">
                <h5>Filtros</h5>
                <div className="row">
                    <div className="col-md-3"><input className="form-control" placeholder="Categoría" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} /></div>
                    <div className="col-md-3"><input className="form-control" placeholder="Buscar" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} /></div>
                    <div className="col-md-3">
                        <select className="form-select" value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}>
                            <option value="">Orden</option>
                            <option value="price_asc">Precio ↑</option>
                            <option value="price_desc">Precio ↓</option>
                            <option value="name_asc">Nombre A-Z</option>
                            <option value="name_desc">Nombre Z-A</option>
                        </select>
                    </div>
                    <div className="col-md-3"><button className="btn btn-primary" onClick={applyFilters}>Aplicar</button></div>
                </div>
            </div>

            <div className="row">
                {products.map(p => (
                    <div key={p._id} className="col-md-3">
                        <div className="card mb-3 p-2">
                            <h6>{p.name}</h6>
                            <p className="small">{p.category}</p>
                            <p>${p.price} — stock: {p.stock}</p>
                            <p className="small">{p.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
