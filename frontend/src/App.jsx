import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Forgot from './pages/auth/ForgotPassword'
import Otp from './pages/auth/OtpVerify'
import UserDashboard from './pages/user/Dashboard'
import Profile from './pages/user/Profile'
import Offers from './pages/user/Offers'
import Redemptions from './pages/user/Redemptions'
import Transactions from './pages/user/Transactions'
import Promotions from './pages/admin/Promotions'
import CampaignBuilder from './pages/admin/CampaignBuilder'
import OffersAdmin from './pages/admin/OffersAdmin'
import FraudMonitor from './pages/admin/FraudMonitor'
import Reports from './pages/admin/Reports'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import { UserProvider } from './context/UserContext'

export default function App(){
  return (
    <UserProvider>
      <div className="app-shell"> 
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/otp" element={<Otp />} />

            {/* User area */}
            <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/user/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
            <Route path="/user/redemptions" element={<ProtectedRoute><Redemptions /></ProtectedRoute>} />
            <Route path="/user/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />

            {/* Admin area */}
            <Route path="/admin" element={<AdminRoute><Promotions /></AdminRoute>} />
            <Route path="/admin/campaigns/new" element={<AdminRoute><CampaignBuilder /></AdminRoute>} />
            <Route path="/admin/offers" element={<AdminRoute><OffersAdmin /></AdminRoute>} />
            <Route path="/admin/fraud" element={<AdminRoute><FraudMonitor /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  )
}
