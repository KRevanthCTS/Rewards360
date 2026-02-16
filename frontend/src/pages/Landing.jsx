import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Logo.svg'
import Image from '../assets/Image.png'

export default function Landing(){
  return (
    <div className="landing-hero">
      <div className="landing-inner">
        <div className="left">
          <h1>Engage your<br/>customers and build<br/>lifelong customer<br/>loyalty</h1>
          <p className="lead">A data-driven customer engagement ecosystem to help you run your most ambitious reward program</p>
          <div className="cta-row">
            <Link to="/register" className="button">Get Started</Link>
            <Link to="/login" className="link" style={{marginLeft:12}}>Already have an account?</Link>
          </div>
        </div>
        <div className="right">
          <div
            className="graphic"
            style={{
              backgroundImage: `url(${Image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <img src={logo} alt="logo" className="landing-logo" />
            <div className="pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
