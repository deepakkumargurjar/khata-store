// frontend/src/components/Register.jsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");      
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/register", { name, email, password });
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user?.name) localStorage.setItem("name", res.data.user.name);
      }
      alert("Registered");
      nav("/");
    } catch (err) {
      console.error("Register error:", err);
      alert(err.response?.data?.msg || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", padding: 30, borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)" }}>
        <h2 style={{ margin: 0, marginBottom: 22, textAlign: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>Create Account</h2>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit" style={{ marginTop: 5, padding: "12px 16px", borderRadius: 10, background: "linear-gradient(90deg, #2563eb, #1e40af)", color: "white", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 15 }}>
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
