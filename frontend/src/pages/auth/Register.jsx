import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function Register(){
  const [f, setF] = useState({ name:'', email:'', phone:'', password:'', role:'USER', preferences:[], communication:'Email' })
  const [err, setErr] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const validate = ()=>{
    const e={}
    if(!f.name) e.name='Name is required'
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email='Valid email is required'
    if(!/^\d{10}$/.test(f.phone)) e.phone='Phone must be 10 digits'
    if(f.password.length<8) e.password='Password must be at least 8 characters'
    return e
  }

  const onChange = (e)=>{
    const {name, value, type, checked} = e.target
    if(name==='preferences'){
      const arr = new Set(f.preferences)
      if(checked) arr.add(value); else arr.delete(value)
      setF(p=>({...p, preferences:[...arr]}));
    } else setF(p=>({...p, [name]: value}))
  }

  const submit = async (e)=>{
    e.preventDefault()
    const v = validate(); setErr(v)
    if(Object.keys(v).length) return
    try{
      await api.post('/auth/register', {
        name:f.name, email:f.email, phone:f.phone, password:f.password,
        role:f.role, preferences:f.preferences.join(','), communication:f.communication
      })
      navigate('/login')
    }catch(ex){ setErr({ api:'Registration failed' }) }
  }

  return (
    <div className="card" style={{margin:'20px auto', maxWidth:720}}>
      <h2 style={{textAlign:'center',fontSize:'30px'}}>Create account</h2>
  <form onSubmit={submit} className="grid cols-2" style={{ gap: 8 }}> 
        <div>
          <label style={{fontSize: '16px'}}>Register as</label>
          <ul className="role-list" style={{margin:6}}>
            <input type="radio" name="role" value="USER" checked={f.role === 'USER'} onChange={onChange} /> User
            <input type="radio" name="role" value="ADMIN" checked={f.role === 'ADMIN'} onChange={onChange} /> Admin
          </ul>
        </div>
        <div>
          <label style={{fontSize: '16px'}}>Name</label>
          <input className="input" name="name" value={f.name} onChange={onChange} placeholder="Enter your Name"/>
          {err.name && <div className="error">{err.name}</div>}
        </div>
        <div>
          <label style={{fontSize: '16px'}}>Email</label>
          <input className="input" name="email" value={f.email} onChange={onChange} placeholder="Enter your Email"/>
          {err.email && <div className="error">{err.email}</div>}
        </div>
        <div>
          <label style={{fontSize: '16px'}}>Phone Number</label>
          <input className="input" name="phone" value={f.phone} onChange={onChange} placeholder="Enter your Phone Number"/>
          {err.phone && <div className="error">{err.phone}</div>}
        </div>
        <div>
          <label style={{fontSize: '16px'}}>Password</label>
          <div style={{position: 'relative'}}>
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={f.password}
              onChange={onChange}
              placeholder="Enter your Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19.5C5.5 19.5 1.5 12 1.5 12c1.46-2.57 3.76-4.7 6.54-6.02" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 3l18 18" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          {err.password && <div className="error">{err.password}</div>}
        </div>
        <div>
          <label style={{fontSize: '16px'}}>Choose your Preferences (For User)</label>
          <div className="flex" style={{flexWrap:'wrap', gap:6}}>
            {['Fashion','Electronics','Groceries','Beauty','Home'].map(opt=> (
              <label key={opt}><input type="checkbox" name="preferences" value={opt} onChange={onChange} /> {opt}</label>
            ))}
          </div>
        </div>
        <div>
          <label style={{fontSize: '16px'}}>Communication</label>
          <div className="flex"> 
            {['Email','SMS','WhatsApp'].map(c => (
              <label key={c}><input type="radio" name="communication" value={c} checked={f.communication===c} onChange={onChange}/> {c}</label>
            ))}
          </div>
        </div>
        <div style={{gridColumn:'1/-1',textAlign:'center'}}>
          {err.api && <div className="error">{err.api}</div>}
          <button className="button" type="submit">Register</button>
          <br />
          <span style={{marginLeft:12}}>Already have an account? <a className="link" href="/login">Login</a></span>
        </div>
      </form>
    </div>
  )
}
