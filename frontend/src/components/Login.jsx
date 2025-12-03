// frontend/src/components/Login.jsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/login", { email, password });
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.user?.name) localStorage.setItem("name", res.data.user.name);
        alert("Logged in");
        nav("/");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto', padding: 20 }}>
      <h2 style={{marginTop:0}}>Login</h2>
      <form onSubmit={handleLogin} style={{display:'grid', gap:8}}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
