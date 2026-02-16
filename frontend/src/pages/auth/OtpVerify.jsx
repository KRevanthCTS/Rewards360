
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OtpVerify(){
  const [otp, setOtp] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const submit = e=>{ e.preventDefault(); if(otp.length!==6){ setErr('OTP must be 6 digits'); return } if(pass.length<8){ setErr('Password must be at least 8 chars'); return } setErr(''); navigate('/login') }
  return (
    <div className="card" style={{margin:'20px auto', maxWidth:480}}>
      <h3>OTP Verification & Change Password</h3>
      <form onSubmit={submit}>
        <input className="input" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
        <input className="input" type="password" placeholder="New Password" value={pass} onChange={e=>setPass(e.target.value)} />
        {err && <div className="error">{err}</div>}
        <button className="button">Update Password</button>
      </form>
    </div>
  )
}
