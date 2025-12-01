// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const [folders, setFolders] = useState([])
  const [folderName, setFolderName] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{ fetchFolders() }, [])

  async function fetchFolders(){
    try{
      const res = await API.get('/folders')
      setFolders(res.data || [])
    }catch(err){
      console.error('fetchFolders error', err);
      if(err.response?.status === 401) {
        alert('Please login first'); navigate('/login');
      }
    }
  }

  async function createFolder(){
    if(!folderName) return alert('Enter name')
    try{
      const res = await API.post('/folders', { name: folderName })
      setFolderName('')
      // navigate to the newly created folder page
      navigate(`/folder/${res.data._id}`)
    }catch(err){
      console.error('createFolder error', err);
      alert(err.response?.data?.msg || 'Error creating folder');
    }
  }

  async function deleteFolder(id){
    if(!window.confirm('Delete folder and all items inside?')) return;
    try{
      await API.delete(`/folders/${id}`)
      setFolders(prev => prev.filter(f => f._id !== id))
    }catch(err){
      console.error('deleteFolder error', err)
      alert(err.response?.data?.msg || 'Delete failed')
    }
  }

  return (
    <div style={{maxWidth:1100, margin:'20px auto'}}>
      <div className="card" style={{marginBottom:16}}>
        <h3 style={{margin:0}}>Create Folder</h3>
        <div style={{marginTop:10, display:'flex', gap:8}}>
          <input value={folderName} onChange={e=>setFolderName(e.target.value)} placeholder="New folder name" style={{flex:1, padding:8, borderRadius:8}} />
          <button className="btn btn-primary" onClick={createFolder}>Create</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Your Folders</h3>
        <div style={{marginTop:12, display:'grid', gap:8}}>
          {folders.length === 0 && <div style={{color:'var(--muted)'}}>No folders yet — create one above</div>}
          {folders.map(f => (
            <div key={f._id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:10, borderRadius:8, border:'1px solid rgba(0,0,0,0.04)'}}>
              <div style={{cursor:'pointer', fontWeight:600}} onClick={()=>navigate(`/folder/${f._id}`)}>{f.name}</div>
              <div style={{display:'flex', gap:8}}>
                <button className="btn" onClick={()=>navigate(`/folder/${f._id}`)}>Open</button>
                <button className="btn" onClick={()=>deleteFolder(f._id)} style={{background:'#ef4444', color:'white'}}>Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
