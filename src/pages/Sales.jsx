import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Sales() {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/sales");
                setSales(res.data);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    return (
        <div>
            <h3>Ventas</h3>
            <ul>
                {sales.map(s => (
                    <li key={s._id}>
                        {s.userId} — {new Date(s.createdAt).toLocaleString()} — Total: ${s.total}
                        <ul>
                            {s.items.map(it => <li key={it.productId}>{it.productId?.name || it.productId} x {it.quantity} @ ${it.price}</li>)}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
