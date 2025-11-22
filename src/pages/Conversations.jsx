import React, { useEffect, useState } from 'react';
import api from "../services/api";

export default function Conversations() {
    const [convs, setConvs] = useState([]);

    const load = async () => {
        try {
            const res = await api.get('/conversations'); // you may need to add a route for admin listing
            setConvs(res.data);
        } catch (err) {
            console.error(err);
            // fallback: if route not present, display message
        }
    };

    useEffect(() => { load(); }, []);

    if (!convs || convs.length === 0) return <p>No hay conversaciones (asegúrate de exponer GET /api/conversations para admin).</p>;

    return (
        <div>
            <h3>Conversaciones</h3>
            <div>
                {convs.map(c => (
                    <div key={c._id} className="card mb-2 p-2">
                        <strong>{c.userId}</strong> — {new Date(c.createdAt).toLocaleString()}
                        <ul>
                            {c.messages.map((m, i) => <li key={i}><b>{m.from}</b>: {m.text}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
