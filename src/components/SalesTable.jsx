import React from 'react';
import formatCurrency from '../utils/formatCurrency';

export default function SalesTable({ sales = [] }) {
    if (!sales || sales.length === 0) return <p>No hay ventas aún</p>;

    return (
        <div className="table-responsive">
            <table className="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Items</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(s => (
                        <tr key={s._id}>
                            <td>{new Date(s.createdAt).toLocaleString()}</td>
                            <td>{s.userId}</td>
                            <td>
                                <ul className="list-unstyled mb-0">
                                    {s.items.map(it => <li key={it.productId}>{it.productId?.name || it.productId} x {it.quantity}</li>)}
                                </ul>
                            </td>
                            <td>{formatCurrency(s.total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
