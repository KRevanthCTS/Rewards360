import React, { useMemo } from 'react'
import { useUser } from '../../context/UserContext'
import '../../styles/Transactions.css'

export default function Transactions() {
  const { transactions, user, loading } = useUser()

  const sortedTransactions = useMemo(() => {
    return [...transactions].reverse()
  }, [transactions])

  if (loading) return <div className="transactions-page">Loading...</div>

  return (
    <div className="transactions-page">
      <div className="transactions-card">
        <div className="transactions-header">
          <h3 className="transactions-title">Transaction History</h3>
          {user && (
            <div className="balance-badge">
              <span className="balance-label">Balance</span>
              <span className="balance-value">{user.profile?.pointsBalance ?? 0}</span>
              <span className="balance-unit">pts</span>
            </div>
          )}
        </div>
        
        <div className="transactions-table-wrap">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Note</th>
                <th>Store</th>
                <th>Date</th>
                <th>Expiry</th>
                <th>Points +/-</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map(it => (
                <tr key={it.id}>
                  <td className="transaction-id">{it.externalId}</td>
                  <td className="transaction-type">{it.type}</td>
                  <td>{it.note}</td>
                  <td>{it.store}</td>
                  <td>{it.date}</td>
                  <td>{it.expiry || '—'}</td>
                  <td className={it.pointsEarned > 0 ? 'points-earned' : it.pointsRedeemed > 0 ? 'points-redeemed' : ''}>
                    {it.pointsEarned > 0 ? `+${it.pointsEarned}` : it.pointsRedeemed > 0 ? `-${it.pointsRedeemed}` : 0}
                  </td>
                </tr>
              ))}
              {sortedTransactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-icon">📊</div>
                    <div>No transactions yet</div>
                    <div className="empty-subtext">Your transaction history will appear here</div>
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
