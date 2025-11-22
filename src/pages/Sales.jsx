import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { alertError } from "../utils/alert.js";

export default function Sales() {
    const [sales, setSales] = useState([]);
    useEffect(() => { (async () => { try { const res = await api.get("/sales"); setSales(res.data); } catch (err) { console.error(err); } })(); }, []);
    const exportExcel = () => {
        const data = sales.map(s => ({ id: s._id, userId: s.userId, total: s.total, date: s.createdAt, items: s.items.map(i => `${i.quantity}x ${i.productId?.name || i.productId}`).join("; ") }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "sales");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), "sales.xlsx");
    };
    return (
        <div>
            <h3>Ventas</h3>
            <button className="btn btn-primary mb-3" onClick={exportExcel}>Exportar Excel</button>
            <ul>
                {sales.map(s => (<li key={s._id}>{s.userId} — {new Date(s.createdAt).toLocaleString()} — Total: ${s.total}</li>))}
            </ul>
        </div>
    );
}
