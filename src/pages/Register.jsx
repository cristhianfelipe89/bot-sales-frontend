// src/pages/Register.jsx
import { useState, useContext } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { alertError } from "../utils/alert.js";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const { handleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", form);
            handleLogin(res.data.user, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alertError(err.response?.data?.msg || "Register failed");
        }
    };

    return (
        <div className="col-md-4 offset-md-4 mt-5 p-4 border rounded shadow">
            <h3>Registrar Admin</h3>
            <form onSubmit={submit}>
                <input className="form-control mb-2" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input className="form-control mb-2" type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button className="btn btn-success w-100">Registrar</button>
            </form>
        </div>
    );
}
