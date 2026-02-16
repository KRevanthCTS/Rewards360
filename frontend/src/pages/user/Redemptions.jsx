import React, { useMemo } from 'react'
import { useUser } from '../../context/UserContext'
import '../../styles/Redemption.css'

export default function Redemptions() {
  const { redemptions, loading } = useUser()

  const sortedRedemptions = useMemo(() => {
    return [...redemptions].reverse()
  }, [redemptions])

  if (loading) return <div className="redemption-page">Loading...</div>

  return (
    <div className="redemption-page">
      <div className="redemption-header">
        <h3 className="redemption-title">My Redemptions</h3>
        <span className="redemption-count">{sortedRedemptions.length} Total</span>
      </div>
      
      {sortedRedemptions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <div>No redemptions yet</div>
          <div className="empty-subtext">Start redeeming offers to see them here!</div>
        </div>
      ) : (
        <div className="redemption-grid">
          {sortedRedemptions.map(it => (
            <div key={it.id} className="redemption-card">
              <div className="redemption-card-header">
                <div className="redemption-offer-title">{it.offerTitle}</div>
                <div className="redemption-points">{it.costPoints} pts</div>
              </div>
              <div className="redemption-card-body">
                <div className="redemption-info-row">
                  <span className="redemption-label">Date:</span>
                  <span className="redemption-value">{it.date}</span>
                </div>
                <div className="redemption-info-row">
                  <span className="redemption-label">Store:</span>
                  <span className="redemption-value">{it.store}</span>
                </div>
                <div className="redemption-info-row">
                  <span className="redemption-label">Confirmation:</span>
                  <span className="redemption-value redemption-code">{it.confirmationCode}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
