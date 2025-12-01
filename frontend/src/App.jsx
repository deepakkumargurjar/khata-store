import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// components
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FolderPage from './components/FolderPage';
import SharePage from './components/SharePage';
import Profile from './components/Profile';
import ItemPage from './components/ItemPage';

// Dark Mode Hook (keeps a theme flag in localStorage)
import useDarkMode from "./utils/useDarkMode";

/* ----------------- NavBar (responsive with hamburger) ----------------- */
function NavBarInner() {
  const nav = useNavigate();
  const [dark, setDark] = useDarkMode();
  const [open, setOpen] = useState(false); // mobile menu open/close

  const userName = localStorage.getItem("name") || "";
  const avatarLetter = userName?.[0]?.toUpperCase() || "U";

  function goTo(path) {
    setOpen(false);
    nav(path);
  }

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 60 }}>
      <div className="nav-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap:12 }}>
        <div className="brand-area" onClick={() => goTo('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div className="logo-mark">💠</div>
          <div>
            <div className="brand-title">Khata.Store</div>
            <div className="brand-sub">Store</div>
          </div>
        </div>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
          <Link to="/" className="nav-link" onClick={() => goTo('/')}>Home</Link>
          <Link to="/profile" className="nav-link" onClick={() => goTo('/profile')}>Profile</Link>
          <Link to="/register" className="nav-link" onClick={() => goTo('/register')}>Register</Link>
          <Link to="/login" className="nav-link" onClick={() => goTo('/login')}>Login</Link>
        </nav>

        <div className="right-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setDark(!dark)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg,#a855f7,#6d28d9)",
              color: "white",
              fontWeight: 700
            }}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light" : "Dark"}
          >
            {dark ? "🌞 Light" : "🌙 Dark"}
          </button>

          <div className="avatar" title={userName} style={{ width: 40, height: 40 }}>
            {avatarLetter}
          </div>

          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(o => !o)}
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect y="0" width="22" height="2" rx="1" fill="currentColor"/>
              <rect y="6" width="22" height="2" rx="1" fill="currentColor"/>
              <rect y="12" width="22" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={`mobile-extra ${open ? 'show' : ''}`} aria-hidden={!open}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
          <button className="btn" onClick={() => goTo('/')}>Home</button>
          <button className="btn" onClick={() => goTo('/profile')}>Profile</button>
          <button className="btn" onClick={() => goTo('/register')}>Register</button>
          <button className="btn" onClick={() => goTo('/login')}>Login</button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBarInner />
      <div className="container" style={{ paddingBottom: 40 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/folder/:id" element={<FolderPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/share/:token" element={<SharePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
