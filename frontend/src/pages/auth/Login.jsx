
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'', role:'USER', mode:'Password' })
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const onChange = e=> setForm(p=>({...p, [e.target.name]: e.target.value}))
  const submit = async e=>{
    e.preventDefault()
    setErr('')
    try{
      const {data} = await api.post('/auth/login', { email: form.email, password: form.password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      if(data.role==='ADMIN') navigate('/admin')
      else navigate('/user')
    }catch(ex){ setErr('Invalid credentials') }
  }

  return (
    <div className="auth-layout"> 
      <div className="left-image" aria-hidden="true"></div>
      <div className="card" style={{margin:'auto', maxWidth:480, width:'100%'}}>
        <h2 style={{textAlign: 'center',fontSize:'30px'}}>Login</h2>
        <p style={{textAlign: 'center',fontSize:'16px'}}>Pick your role, then login using your password or OTP.</p>
        <form onSubmit={submit}>
          <label>Login as:</label>
          <div className="flex" style={{gap:12}}> 
            <select name="role" value={form.role} onChange={onChange} className="input" style={{flex:1}}>
              <option>USER</option>
              <option>ADMIN</option>
            </select>
            <select name="mode" value={form.mode} onChange={onChange} className="input" style={{flex:1}}>
              <option>Password</option>
              <option>OTP</option>
            </select>
          </div>
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="input" name="password" placeholder="Password" type="password" value={form.password} onChange={onChange} required minLength={8} />
          {err && <div className="error">{err}</div>}
          <button className="button" type="submit" style={{display: 'block', margin: '12px auto 0', fontSize: '16px'}}>Login</button>
        </form>
        <div className="flex" style={{marginTop:8, justifyContent:'space-between'}}>
          <Link className="link" to="/forgot">Forgot Password?</Link>
          <span>New here? <Link className="link" to="/register">Register</Link></span>
        </div>
      </div>
    </div>
  )
}
