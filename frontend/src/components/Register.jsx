import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");      
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });
      if (res.data.token) localStorage.setItem("token", res.data.token);
      alert("Registered");
      nav("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Registration error");
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          padding: 30,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: 22,
            textAlign: "center",
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Create Account
        </h2>

        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 15,
            }}
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 15,
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 15,
            }}
          />

          <button
            type="submit"
            style={{
              marginTop: 5,
              padding: "12px 16px",
              borderRadius: 10,
              background: "linear-gradient(90deg, #2563eb, #1e40af)",
              color: "white",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-3px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
