// frontend/src/components/ItemPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function ItemPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(()=>{ load(); }, [id]);

  async function load(){
    setLoading(true);
    try {
      const res = await API.get(`/items/${id}`);
      setItem(res.data);
      setTitle(res.data.title || '');
      setAmount(res.data.amount !== undefined ? String(res.data.amount) : '');
      setDescription(res.data.description || '');
    } catch (err) {
      console.error(err);
      alert('Item not found');
      nav(-1);
    } finally { setLoading(false) }
  }

  async function save(){
    try {
      await API.put(`/items/${id}`, { title, amount: Number(amount || 0), description });
      alert('Saved');
      setEditing(false);
      await load();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  }

  async function del(){
    if(!window.confirm('Delete item?')) return;
    try {
      await API.delete(`/items/${id}`);
      alert('Deleted');
      nav(-1);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  if(loading) return <div className="card">Loading...</div>;
  if(!item) return null;

  return (
    <div style={{maxWidth:900, margin:'20px auto'}}>
      <div className="card" style={{padding:16}}>
        <button className="btn" onClick={()=>nav(-1)} style={{marginBottom:12}}>Back</button>
        <div style={{display:'flex', gap:16, alignItems:'flex-start'}}>
          <div style={{flex:'0 0 360px'}}>
            {item.imageUrl ? <img src={item.imageUrl} alt="img" style={{width:'100%', borderRadius:8}} /> : <div style={{height:320, background:'#f3f4f6', borderRadius:8}} />}
          </div>
          <div style={{flex:1}}>
            {editing ? (
              <div style={{display:'grid', gap:8}}>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
                <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" />
                <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-primary" onClick={save}>Save</button>
                  <button className="btn" onClick={()=>setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{marginTop:0}}>{item.title}</h2>
                <div style={{color:'var(--muted)', marginBottom:8}}>₹ {item.amount}</div>
                <div style={{marginTop:8, whiteSpace:'pre-wrap'}}>{item.description}</div>
                <div style={{marginTop:12, display:'flex', gap:8}}>
                  <button className="btn" onClick={()=>setEditing(true)}>Edit</button>
                  <button className="btn" onClick={del} style={{background:'#ef4444', color:'white'}}>Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
