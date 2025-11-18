import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            nav("/dashboard");
        } catch (err) {
            alert(err.response?.data?.msg || "Error al iniciar sesión");
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <h3>Admin Login</h3>
                <form onSubmit={submit}>
                    <input className="form-control my-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input className="form-control my-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="btn btn-primary">Entrar</button>
                </form>
            </div>
        </div>
    );
}
