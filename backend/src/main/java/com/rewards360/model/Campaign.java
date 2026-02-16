
package com.rewards360.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Campaign {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String discountType; // Percentage, Flat, etc.
    private String category;
    private String imageUrl;
    private int costPoints;
    private LocalDate startDate;
    private LocalDate endDate;
    @Lob
    private String description;
    private boolean addToOffers;
}
