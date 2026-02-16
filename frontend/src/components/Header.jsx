
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Logo.svg'

export default function Header(){
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const logout = ()=>{ localStorage.clear(); navigate('/login') }
  return (
    <header>
      <div className="navbar flex"> 
        <Link to="/" className="brand">
          <img src={logo} alt="Rewards360" className="brand-logo" />
          <strong>Rewards360</strong>
        </Link>
        <nav style={{marginLeft:'auto'}}>
          {role==='ADMIN' && (<>
            <Link className="nav-link" to="/admin">Promotions</Link>
            <Link className="nav-link" to="/admin/offers">Offers</Link>
            <Link className="nav-link" to="/admin/fraud">Fraud Monitor</Link>
            <Link className="nav-link" to="/admin/reports">Report</Link>
          </>)}
          {role==='USER' && (<>
            <Link className="nav-link" to="/user">Dashboard</Link>
            <Link className="nav-link" to="/user/profile">Profile</Link>
            <Link className="nav-link" to="/user/offers">Offers</Link>
            <Link className="nav-link" to="/user/redemptions">Redemptions</Link>
            <Link className="nav-link" to="/user/transactions">Transactions</Link>
          </>)}
          {!role && (
            <>
              {/* mark login with an auth-link class so we can style it identically to the register button */}
              <Link className="nav-link auth-link" to="/login">Login</Link>
              <Link className="button" to="/register" style={{marginLeft:8}}>Register</Link>
            </>
          )}
          {role && <button className="button logout" onClick={logout}>Logout</button>}
        </nav>
      </div>
    </header>
  )
}
