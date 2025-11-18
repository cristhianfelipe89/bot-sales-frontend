import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Users() {
    const [users, setUsers] = useState([]);

    const load = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert('Necesitas estar autenticado como admin');
        }
    };

    useEffect(() => { load(); }, []);

    return (
        <div>
            <h3>Usuarios</h3>
            <ul>
                {users.map(u => (
                    <li key={u._id}>{u.name} — {u.email} — {u.role}</li>
                ))}
            </ul>
        </div>
    );
}
