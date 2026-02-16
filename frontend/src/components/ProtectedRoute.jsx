
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({children}){
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if(!token || !role) return <Navigate to="/login" />
  if(role !== 'USER') return <Navigate to="/login" />
  return children
}
