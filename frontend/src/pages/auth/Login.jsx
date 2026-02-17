
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { useUser } from '../../context/UserContext'

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'', role:'USER', mode:'Password' })
  const [err, setErr] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { refreshAll } = useUser()

  const onChange = e=> setForm(p=>({...p, [e.target.name]: e.target.value}))
  const submit = async e=>{
    e.preventDefault()
    setErr('')
    try{
      const {data} = await api.post('/auth/login', { email: form.email, password: form.password })
      // Ensure the selected role on the form matches the role returned by the server
      if (data.role && data.role.toUpperCase() !== (form.role || '').toUpperCase()) {
        // Inform the user and do not store the token or log them in
        alert('Selected role does not match the account role.\nPlease select the correct role.')
        setErr('Please select the correct role and try again.')
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      // Trigger a global refresh so user data, offers, transactions and redemptions
      // are loaded immediately and pages don't stay in a Loading... state.
      try {
        await refreshAll()
      } catch (refreshErr) {
        // Don't block navigation on refresh failure, but log for debugging
        console.warn('Failed to refresh user data after login', refreshErr)
      }
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
          <div className="flex" style={{gap:12, alignItems: 'flex-start'}}> 
            <ul className="role-list" style={{alignItems: 'center', margin:6}}>
              <input type="radio" name="role" value="USER" checked={form.role === 'USER'} onChange={onChange} /> User
              <input type="radio" name="role" value="ADMIN" checked={form.role === 'ADMIN'} onChange={onChange} /> Admin
            </ul>
          </div>
          <input className="input" 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={onChange} required />
          <div style={{position: 'relative'}}>
            <input className="input"
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={onChange}
              required
              minLength={8}
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
                // open eye icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                // closed eye (eye with slash)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19.5C5.5 19.5 1.5 12 1.5 12c1.46-2.57 3.76-4.7 6.54-6.02" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 3l18 18" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" stroke="#0b5ed7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
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
