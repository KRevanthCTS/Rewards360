
package com.rewards360.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rewards360.model.Offer;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    
    /**
     * Find offers available for a specific tier
     * Returns offers where:
     * 1. tierLevel is null (available to all tiers)
     * 2. tierLevel matches the user's tier
     * 3. tierLevel is lower than user's tier (e.g., Gold users can see Bronze and Silver offers)
     */
    @Query("""
        SELECT o FROM Offer o 
        WHERE o.active = true 
        AND (
            o.tierLevel IS NULL 
            OR o.tierLevel = :userTier
            OR (o.tierLevel = 'Bronze')
            OR (o.tierLevel = 'Silver' AND :userTier IN ('Silver', 'Gold', 'Platinum'))
            OR (o.tierLevel = 'Gold' AND :userTier IN ('Gold', 'Platinum'))
            OR (o.tierLevel = 'Platinum' AND :userTier = 'Platinum')
        )
        ORDER BY o.costPoints ASC
    """)
    List<Offer> findAvailableOffersForTier(@Param("userTier") String userTier);
}
