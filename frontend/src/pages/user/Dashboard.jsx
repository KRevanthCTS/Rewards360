// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useUser } from '../../context/UserContext'
import '../../styles/Dashboard.css'

function ClaimCard({ a, onClaimed, isClaimed }) {
  const [busy, setBusy] = useState(false)
  const { claimPoints } = useUser()

  const claim = async () => {
    setBusy(true)
    try {
      await claimPoints(a.code, a.points, a.title)
      onClaimed(a.code)
    } catch (error) {
      console.error('Failed to claim:', error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="d-card d-claim-card">
      <h4 className="d-card-title">{a.title}</h4>
      <p>Earn {a.points} points</p>
      {!isClaimed ? (
        <button disabled={busy} className="d-btn" onClick={claim}>
          {busy ? 'Claiming…' : 'Claim'}
        </button>
      ) : (
        <span className="d-badge">Claimed</span>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user, transactions, loading } = useUser()
  const [claimedActivities, setClaimedActivities] = useState([])

  // Create a unique storage key for this specific user
  const userStorageKey = user ? `claimedActivities_${user.id}` : null

  // Effect to load user-specific claims when the component mounts or user changes
  useEffect(() => {
    if (userStorageKey) {
      const saved = sessionStorage.getItem(userStorageKey)
      setClaimedActivities(saved ? JSON.parse(saved) : [])
    }
  }, [userStorageKey])

  // Effect to save to sessionStorage whenever claimedActivities changes
  useEffect(() => {
    if (userStorageKey) {
      sessionStorage.setItem(userStorageKey, JSON.stringify(claimedActivities))
    }
  }, [claimedActivities, userStorageKey])

  const handleClaimed = (code) => {
    setClaimedActivities(prev => [...prev, code])
  }

  if (loading || !user) return <div className="d-page">Loading...</div>

  const activities = [
    { title: 'Daily Login Bonus', points: 50, code: 'LOGIN' },
    { title: 'Write a Product Review', points: 100, code: 'REVIEW' },
    { title: 'Share on Social', points: 75, code: 'SOCIAL' },
    { title: 'Refer a Friend', points: 200, code: 'REFER' },
  ]

  const nextExpiry = user.profile?.nextExpiryDate ?? '23/2/2026'

  // Date Logic
  const today = new Date().toISOString().split('T')[0]
  const todayTransactions = transactions.filter(t => t.date === today)
  const pointsEarnedToday = todayTransactions.reduce((sum, t) => sum + (t.pointsEarned || 0), 0)
  const pointsRedeemedToday = todayTransactions.reduce((sum, t) => sum + (t.pointsRedeemed || 0), 0)
  const totalPointsEarned = user.profile?.lifetimePoints ?? 0

  return (
    <div className="d-page">
      {/* ===== Points Summary ===== */}
      <div className="d-card d-ps">
        <div className="d-ps-row">
          <div className="d-ps-left">
            <h3 className="d-ps-title">Points Summary</h3>
            <p className="d-ps-sub">
              Member: <span className="d-ps-strong">{user.name}</span>
              <span className="d-ps-dot">·</span>
              Tier: <span className="d-ps-strong">{user.profile?.loyaltyTier}</span>
            </p>
            <div className="d-ps-pill">
              <span className="d-ps-pill-label">Next Expiry</span>
              <span className="d-ps-pill-value">{nextExpiry}</span>
            </div>
          </div>

          <div className="d-ps-right">
            <div className="d-ps-right-label">Current Balance</div>
            <div className="d-ps-right-value">{user.profile?.pointsBalance ?? 0}</div>
          </div>
        </div>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="d-stats-row">
        <div className="d-stat-card">
          <div className="d-stat-icon">📊</div>
          <div className="d-stat-content">
            <div className="d-stat-label">Total Earned</div>
            <div className="d-stat-value">{totalPointsEarned}</div>
          </div>
        </div>
        <div className="d-stat-card">
          <div className="d-stat-icon">⬆️</div>
          <div className="d-stat-content">
            <div className="d-stat-label">Earned Today</div>
            <div className="d-stat-value d-stat-earned">{pointsEarnedToday}</div>
          </div>
        </div>
        <div className="d-stat-card">
          <div className="d-stat-icon">⬇️</div>
          <div className="d-stat-content">
            <div className="d-stat-label">Redeemed Today</div>
            <div className="d-stat-value d-stat-redeemed">{pointsRedeemedToday}</div>
          </div>
        </div>
      </div>

      {/* ===== Daily Activities ===== */}
      <div className="d-card">
        <h3 className="d-section-title">Daily Activities</h3>
        <div className="d-activities-row">
          {activities.map(a => (
            <ClaimCard 
              key={a.code} 
              a={a} 
              onClaimed={handleClaimed}
              isClaimed={claimedActivities.includes(a.code)}
            />
          ))}
        </div>
      </div>

      {/* ===== Recent Transactions ===== */}
      <div className="d-card">
        <h3 className="d-section-title">Recent Transactions</h3>
        <div className="d-table-wrap">
          <table className="d-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Points Earned</th>
                <th>Points Redeemed</th>
                <th>Store/Activity</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.type}</td>
                  <td style={{ color: t.pointsEarned > 0 ? '#059669' : '#64748b', fontWeight: t.pointsEarned > 0 ? '700' : '500' }}>
                    {t.pointsEarned > 0 ? `+${t.pointsEarned}` : t.pointsEarned || '—'}
                  </td>
                  <td style={{ color: t.pointsRedeemed > 0 ? '#dc2626' : '#64748b', fontWeight: t.pointsRedeemed > 0 ? '700' : '500' }}>
                    {t.pointsRedeemed > 0 ? `-${t.pointsRedeemed}` : t.pointsRedeemed || '—'}
                  </td>
                  <td>{t.store || t.note}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: 12 }}>
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}