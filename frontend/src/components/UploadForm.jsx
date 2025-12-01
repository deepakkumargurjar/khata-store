// frontend/src/components/UploadForm.jsx
import React, { useState } from 'react'
import API from '../api'

export default function UploadForm({ folderId, onAdded }){
  const [file, setFile] = useState(null)
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    const form = new FormData()
    form.append('folderId', folderId)
    if(file) form.append('image', file)
    form.append('amount', amount || 0)
    form.append('title', title)
    form.append('description', description)
    try{
      const res = await API.post('/items', form, { headers: {'Content-Type':'multipart/form-data'} })
      setFile(null); setAmount(''); setTitle(''); setDescription('')
      if(onAdded) onAdded(res.data)
    }catch(err){
      console.error(err)
      alert('Upload error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <form className="upload-form" onSubmit={submit}>

      <label className="upload-row">
        <span className="upload-label">Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={e=>setFile(e.target.files[0])}
          className="upload-input"
        />
      </label>

      <label className="upload-row">
        <span className="upload-label">Title</span>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="upload-input" />
      </label>

      <label className="upload-row">
        <span className="upload-label">Amount</span>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="upload-input" inputMode="numeric" />
      </label>

      <label className="upload-row full">
        <span className="upload-label">Description</span>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="upload-textarea" />
      </label>

      <div className="upload-actions">
        <button type="submit" className="btn btn-primary upload-btn" disabled={loading}>
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </form>
  )
}
