// src/pages/Login.jsx
import { useState } from "react";
import api from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { alertError } from "../utils/alert.js";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { handleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { ...form });
            handleLogin(res.data.user, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alertError(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div className="col-md-4 offset-md-4 mt-5 p-4 border rounded shadow">
            <h3>Iniciar sesión (Admin web)</h3>
            <form onSubmit={submit}>
                <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input type="password" className="form-control mb-2" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button className="btn btn-primary w-100">Ingresar</button>
            </form>
            <div className="mt-2 text-center"><Link to="/register">Registrar Admin</Link></div>
        </div>
    );
}
