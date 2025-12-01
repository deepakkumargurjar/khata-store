// frontend/src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        // optionally save name
        if (res.data.user?.name) localStorage.setItem('name', res.data.user.name);
        alert('Logged in');
        nav('/'); // go to dashboard
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Invalid credentials');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '24px auto', padding: 20 }}>
      <h2 style={{marginTop:0}}>Login</h2>
      <form onSubmit={handleLogin} style={{display:'grid', gap:8}}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
