// frontend/src/components/Profile.jsx
import React from "react";

export default function Profile() {
  const user = localStorage.getItem("token");

  return (
    <div className="card" style={{ padding: 20 }}>
      <h2>User Profile</h2>

      {!user && (
        <div style={{ marginTop: 10, color: "var(--muted)" }}>
          Not logged in. Please login first.
        </div>
      )}

      {user && (
        <div style={{ marginTop: 10 }}>
          <p><strong>Token:</strong></p>
          <div
            style={{
              background: "var(--card)",
              padding: 10,
              borderRadius: 8,
              wordBreak: "break-all",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            {user}
          </div>
        </div>
      )}
    </div>
  );
}
