
package com.rewards360.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank String name,
        @Email String email,
        @Pattern(regexp="^[0-9]{10}$", message = "Phone must be 10 digits") String phone,
        @Size(min=8, message="Password must be at least 8 characters") String password,
        @NotBlank String role,
        String preferences,
        String communication
) {}
