import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CategoryForm from '../components/CategoryForm';

export default function Categories() {
    const [cats, setCats] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });

    const load = async () => {
        try {
            const res = await api.get('/categories');
            setCats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', form);
            setForm({ name: '', description: '' });
            load();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error crear categoría');
        }
    };

    return (
        <div>
            <h3>Categorías</h3>
            <div className="row">
                <div className="col-md-5">
                    <div className="card p-3 mb-3">
                        <h5>Crear categoría</h5>
                        <CategoryForm form={form} setForm={setForm} onSubmit={handleCreate} />
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="card p-3">
                        <h5>Lista</h5>
                        <ul>
                            {cats.map(c => <li key={c._id}>{c.name} — {c.description}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
