// frontend/src/components/FolderPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import UploadForm from './UploadForm';

export default function FolderPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const [folder, setFolder] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); }, [id]);

  async function load(){
    setLoading(true);
    try {
      const fRes = await API.get(`/folders/${id}`);
      setFolder(fRes.data);
      const itRes = await API.get(`/items/folder/${id}`);
      setItems(itRes.data.items || []);
      setTotal(itRes.data.total || 0);
    } catch (err) {
      console.error('FolderPage load error', err);
      if (err.response?.status === 401) { alert('Please login'); nav('/login'); }
      if (err.response?.status === 404) { alert('Folder not found'); nav('/'); }
    } finally {
      setLoading(false);
    }
  }

  async function handleItemAdded(){
    await load();
  }

  async function deleteItem(id){
    if(!window.confirm('Delete item?')) return;
    try {
      await API.delete(`/items/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  if(loading) return <div className="card">Loading...</div>;

  return (
    <div style={{maxWidth:1100, margin:'20px auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <div>
          <h2 style={{margin:0}}>{folder?.name}</h2>
          <div style={{color:'var(--muted)'}}>Folder ID: {folder?._id}</div>
        </div>
      </div>

      <div className="card" style={{marginBottom:12}}>
        <h3 style={{marginTop:0}}>Upload to folder</h3>
        <UploadForm folderId={id} onAdded={handleItemAdded} />
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3>Gallery</h3>
          <div style={{color:'var(--muted)'}}>Total ₹ <strong>{total}</strong></div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12, marginTop:12}}>
          {items.length === 0 && <div style={{color:'var(--muted)'}}>No items yet</div>}
          {items.map(it => (
            <div key={it._id} className="card" style={{padding:8, cursor:'pointer'}} onClick={()=>nav(`/item/${it._id}`)}>
              {it.imageUrl ? <img src={it.imageUrl} alt="img" style={{width:'100%', height:160, objectFit:'cover', borderRadius:8}} /> : <div style={{height:160, background:'#f3f4f6'}}/>}
              <div style={{marginTop:8, fontWeight:600}}>{it.title}</div>
              <div style={{color:'var(--muted)'}}>₹ {it.amount}</div>
              <div style={{marginTop:8, display:'flex', gap:8}}>
                <button className="btn" onClick={(e)=>{ e.stopPropagation(); nav(`/item/${it._id}`); }}>Open</button>
                <button className="btn" onClick={(e)=>{ e.stopPropagation(); deleteItem(it._id); }} style={{background:'#ef4444', color:'white'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
