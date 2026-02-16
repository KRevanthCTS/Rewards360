/**
 * User Context Provider
 * Manages user data globally to prevent unnecessary reloads and API calls
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import userService from '../services/userService'

const UserContext = createContext(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [offers, setOffers] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user profile
  const fetchUser = useCallback(async () => {
    try {
      const userData = await userService.getMe()
      setUser(userData)
      return userData
    } catch (err) {
      console.error('Error fetching user:', err)
      setError(err)
      throw err
    }
  }, [])

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const data = await userService.getTransactions()
      setTransactions(data)
      return data
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err)
      throw err
    }
  }, [])

  // Fetch offers
  const fetchOffers = useCallback(async () => {
    try {
      const data = await userService.getOffersForMyTier()  // Use tier-based offers
      setOffers(data)
      return data
    } catch (err) {
      console.error('Error fetching offers:', err)
      setError(err)
      throw err
    }
  }, [])

  // Fetch redemptions
  const fetchRedemptions = useCallback(async () => {
    try {
      const data = await userService.getRedemptions()
      setRedemptions(data)
      return data
    } catch (err) {
      console.error('Error fetching redemptions:', err)
      setError(err)
      throw err
    }
  }, [])

  // Claim points
  const claimPoints = useCallback(async (activityCode, points, note) => {
    try {
      await userService.claimPoints(activityCode, points, note)
      // Refresh user and transactions after claiming
      await Promise.all([fetchUser(), fetchTransactions()])
    } catch (err) {
      console.error('Error claiming points:', err)
      setError(err)
      throw err
    }
  }, [fetchUser, fetchTransactions])

  // Redeem offer
  const redeemOffer = useCallback(async (offerId, store) => {
    try {
      await userService.redeemOffer(offerId, store)
      // Refresh user, transactions, and redemptions after redeeming
      await Promise.all([fetchUser(), fetchTransactions(), fetchRedemptions()])
    } catch (err) {
      console.error('Error redeeming offer:', err)
      setError(err)
      throw err
    }
  }, [fetchUser, fetchTransactions, fetchRedemptions])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchUser(),
        fetchTransactions(),
        fetchOffers(), 
        fetchRedemptions()
      ])
    } catch (err) {
      console.error('Error refreshing data:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchUser, fetchTransactions, fetchOffers, fetchRedemptions])

  // Initialize data on mount (only if user is authenticated)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      refreshAll()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    user,
    transactions,
    offers,
    redemptions,
    loading,
    error,
    fetchUser,
    fetchTransactions,
    fetchOffers,
    fetchRedemptions,
    claimPoints,
    redeemOffer,
    refreshAll,
    setUser,
    setLoading
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
