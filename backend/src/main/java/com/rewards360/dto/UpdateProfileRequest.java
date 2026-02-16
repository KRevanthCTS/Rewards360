package com.rewards360.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String preferences;
    private String communication; 
}