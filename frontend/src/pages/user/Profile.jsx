import React, { useState } from 'react'
import { useUser } from '../../context/UserContext'
import userService from '../../services/userService'
import '../../styles/Profile.css'

export default function Profile() {
  const { user, loading, fetchUser } = useUser()
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', preferences:'', communication:'' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  if (loading || !user) return <div className="profile-page">Loading...</div>

  const prefs = (user.profile?.preferences || '').split(',').filter(Boolean)

  const startEdit = ()=>{
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      preferences: user.profile?.preferences || '',
      communication: user.profile?.communication || ''
    })
    setMsg('')
    setErr('')
    setEdit(true)
  }

  const onChange = e=>{
    const {name, value} = e.target
    setForm(f=>({...f, [name]: value}))
  }

  const save = async e=>{
    e?.preventDefault()
    setBusy(true); setErr(''); setMsg('')
    try{
      await userService.updateProfile(form)
      setMsg('Profile updated')
      setEdit(false)
      // refresh user context
      await fetchUser()
    }catch(ex){
      console.error(ex)
      setErr(ex?.response?.data?.message || 'Failed to update profile')
    }finally{ setBusy(false) }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{user.name}</h2>
            <span className="profile-tier">{user.profile?.loyaltyTier || 'Bronze'} Member</span>
          </div>
        </div>

        <div className="profile-details">
          {!edit ? (
            <>
              <div className="profile-item">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Phone</span>
                <span className="profile-value">{user.phone}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Points Balance</span>
                <span className="profile-value profile-points">{user.profile?.pointsBalance ?? 0}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Preferences</span>
                <span className="profile-value">{prefs.join(', ') || '—'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Communication</span>
                <span className="profile-value">{user.profile?.communication || 'Email'}</span>
              </div>
              <div style={{marginTop:12}}>
                <button className="button" onClick={startEdit}>Edit Profile</button>
              </div>
              {msg && <div className="badge" style={{marginTop:8}}>{msg}</div>}
            </>
          ) : (
            <form onSubmit={save} style={{display:'grid', gap:8}}>
              <label>Name</label>
              <input className="input" name="name" value={form.name} onChange={onChange} />
              <label>Phone</label>
              <input className="input" name="phone" value={form.phone} onChange={onChange} />
              <label>Preferences (comma separated)</label>
              <input className="input" name="preferences" value={form.preferences} onChange={onChange} />
              <label>Preferred Communication</label>
              <select className="input" name="communication" value={form.communication} onChange={onChange}>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
              {err && <div className="error">{err}</div>}
              <div style={{display:'flex', gap:8}}>
                <button className="button" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
                <button type="button" className="button" onClick={()=>setEdit(false)} disabled={busy} style={{background:'#ccc'}}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}