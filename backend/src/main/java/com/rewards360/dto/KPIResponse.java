
package com.rewards360.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KPIResponse {
    private long users;
    private long offers;
    private long redemptions;
    private double redemptionRate;
}
    