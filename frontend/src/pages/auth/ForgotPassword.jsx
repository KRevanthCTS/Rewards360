
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const submit = e=>{ e.preventDefault(); if(!email.includes('@')){ setErr('Enter a valid email'); return } setErr(''); setSent(true) }
  return (
    <div className="card" style={{margin:'20px auto', maxWidth:480}}>
      <h3>Forgot Password</h3>
      {!sent ? (
        <form onSubmit={submit}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          {err && <div className="error">{err}</div>}
          <button className="button">Send OTP</button>
        </form>
      ): (
        <div>
          <p>OTP sent to {email}. Proceed to verification.</p>
          <button className="button" onClick={()=>navigate('/otp')}>Verify OTP</button>
        </div>
      )}
    </div>
  )
}
