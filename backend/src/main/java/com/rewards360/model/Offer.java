// package com.rewards360.model;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// @Entity
// @Table(name = "offer")
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// public class Offer {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @Column(name = "title", nullable = false, length = 200)
//     private String title;
    
//     @Column(name = "category", length = 100)
//     private String category;
    
//     @Column(name = "description", length = 1000)
//     private String description;
    
//     @Column(name = "cost_points", nullable = false)
//     private int costPoints;
    
//     @Column(name = "image_url", length = 500)
//     private String imageUrl;
    
//     @Column(name = "active", nullable = false)
//     private boolean active;
    
//     @Column(name = "tier_level", length = 20)
//     private String tierLevel;  // Bronze, Silver, Gold, Platinum, or null for all tiers
    
// }
package com.rewards360.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "offer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "category", length = 100)
    private String category;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "cost_points", nullable = false)
    private int costPoints;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "active", nullable = false)
    private boolean active;
    
    @Column(name = "tier_level", length = 20)
    private String tierLevel;  // Bronze, Silver, Gold, Platinum, or null for all tiers

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
    
}