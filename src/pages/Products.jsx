// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        price: 0,
        stock: 0
    });

    const [editingId, setEditingId] = useState(null);

    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error loading products", err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Error loading categories", err);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación adicional
        if (!form.category || form.category === "") {
            alert("Debes seleccionar una categoría válida");
            return;
        }

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, form);
            } else {
                await api.post("/products", form);
            }

            setForm({
                name: "",
                description: "",
                category: "",
                price: 0,
                stock: 0
            });
            setEditingId(null);
            loadProducts();
        } catch (err) {
            alert(err.response?.data?.msg || "Error al guardar producto");
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(products);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(blob, "productos.xlsx");
    };

    return (
        <div>
            <h3>Productos</h3>

            <div className="card p-3 mb-4">
                <h5>{editingId ? "Editar producto" : "Crear producto"}</h5>
                <ProductForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    editing={!!editingId}
                    categories={categories}
                />
            </div>

            <button className="btn btn-success mb-3" onClick={exportToExcel}>
                Exportar a Excel
            </button>

            <div className="card p-3">
                <h5>Inventario</h5>
                <ProductTable data={products} />
            </div>
        </div>
    );
}
