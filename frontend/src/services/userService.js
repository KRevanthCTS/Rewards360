/**
 * Centralized User API Service
 * All user-related API calls are defined here
 */
import api from '../api/client'

const userService = {
  // Get current user profile
  getMe: async () => {
    const response = await api.get('/user/me')
    return response.data
  },

  // Get user transactions
  getTransactions: async () => {
    const response = await api.get('/user/transactions')
    return response.data
  },

  // Get available offers
  getOffers: async () => {
    const response = await api.get('/user/offers/')
    return response.data
  },

  // Get offers based on user tier
  getOffersForMyTier: async () => {
    const response = await api.get('/user/offers/my-tier')
    return response.data
  },

  // Get user redemptions
  getRedemptions: async () => {
    const response = await api.get('/user/redemptions')
    return response.data
  },

  // Claim points (activity)
  claimPoints: async (activityCode, points, note) => {
    const response = await api.post('/user/claim', {
      activityCode,
      points,
      note
    })
    return response.data
  },

  // Redeem an offer
  redeemOffer: async (offerId, store) => {
    const response = await api.post('/user/redeem', {
      offerId,
      store
    })
    return response.data
  }
  ,
  // Update user profile (safe subset)
  updateProfile: async (payload) => {
    const response = await api.put('/user/profile', payload)
    return response.data
  }
}

export default userService
