// frontend/src/components/SharePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function SharePage(){
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); }, [token]);

  async function load(){
    setLoading(true);
    try {
      const res = await API.get(`/folders/share/token/${token}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert('Not found or removed');
    } finally { setLoading(false); }
  }

  if (loading) return <div className="card">Loading...</div>;
  if (!data) return <div className="card">Not found</div>;

  return (
    <div>
      <h2>{data.folder.name}</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12, marginTop:12}}>
        {data.items.map(it => (
          <div key={it._id} className="card" style={{padding:8}}>
            {it.imageUrl ? <img src={it.imageUrl} alt="img" style={{width:'100%', height:160, objectFit:'cover'}} /> : null}
            <div style={{marginTop:8, fontWeight:600}}>{it.title}</div>
            <div style={{color:'var(--muted)'}}>₹ {it.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
