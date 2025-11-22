import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Sales from "./pages/Sales.jsx";
import Conversations from "./pages/Conversations.jsx";
import Users from "./pages/Users.jsx";
import Categories from "./pages/Categories.jsx";   // ⬅️ IMPORTANTE

import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import UserProfile from "./pages/UserProfile.jsx";

export default function App() {
    return (
        <>
            <NavBar />

            <div className="container mt-4">
                <Routes>
                    {/* Publicas */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin protegidas */}
                    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/:id/profile" element={<UserProfile />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/categories" element={<Categories />} /> {/* ⬅️ AGREGADA */}
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/conversations" element={<Conversations />} />
                        <Route path="/users" element={<Users />} />
                    </Route>

                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </div>
        </>
    );
}

