package com.rewards360.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for exposing offer analytics fields:
 * id, title, category, costPoints
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferAnalyticsDto {
    private Long id;
    private String title;
    private String category;
    private int costPoints;
}