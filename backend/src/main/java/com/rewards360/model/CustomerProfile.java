package com.rewards360.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "loyalty_tier", nullable = false, length = 20)
    private String loyaltyTier;
    
    @Column(name = "points_balance", nullable = false)
    private int pointsBalance;
    
    @Column(name = "lifetime_points", nullable = false)
    private int lifetimePoints; // Total points earned in lifetime
    
    @Column(name = "next_expiry")
    private LocalDate nextExpiry;
    
    @Column(name = "preferences", length = 500)
    private String preferences; // CSV of categories
    
    @Column(name = "communication", length = 50)
    private String communication; // Email/SMS/WhatsApp
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    @JsonIgnore
    private User user;
    
    /**
     * JPA lifecycle callback - Updates tier before insert
     * Automatically calculates tier based on lifetime points
     */
    @PrePersist
    public void beforeInsert() {
        updateTierBasedOnLifetimePoints();
    }
    
    /**
     * JPA lifecycle callback - Updates tier before update
     * Automatically recalculates tier based on lifetime points
     */
    @PreUpdate
    public void beforeUpdate() {
        updateTierBasedOnLifetimePoints();
    }
    
    /**
     * Calculate and update tier based on lifetime points
     * Bronze: 0 - 1,999 lifetime points
     * Silver: 2,000 - 4,999 lifetime points
     * Gold: 5,000 - 9,999 lifetime points
     * Platinum: 10,000+ lifetime points
     */
    private void updateTierBasedOnLifetimePoints() {
        if (this.lifetimePoints >= 10000) {
            this.loyaltyTier = "Platinum";
        } else if (this.lifetimePoints >= 5000) {
            this.loyaltyTier = "Gold";
        } else if (this.lifetimePoints >= 2000) {
            this.loyaltyTier = "Silver";
        } else {
            this.loyaltyTier = "Bronze";
        }
    }
}
