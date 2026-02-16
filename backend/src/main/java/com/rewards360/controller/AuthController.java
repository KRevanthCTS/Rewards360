
package com.rewards360.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rewards360.dto.AuthResponse;
import com.rewards360.dto.LoginRequest;
import com.rewards360.dto.RegisterRequest;
import com.rewards360.model.CustomerProfile;
import com.rewards360.model.Role;
import com.rewards360.model.User;
import com.rewards360.repository.UserRepository;
import com.rewards360.service.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        // Create user
        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(Role.valueOf(req.role().toUpperCase()));
        
        // Create customer profile
        CustomerProfile profile = new CustomerProfile();
        profile.setLoyaltyTier("Bronze");
        profile.setPointsBalance(2000);
        profile.setLifetimePoints(2000); // Initialize lifetime points with starting balance
        profile.setPreferences(req.preferences());
        profile.setCommunication(req.communication());
        profile.setUser(user);
        
        // Set profile to user
        user.setProfile(profile);
        
        // Save user
        userRepository.save(user);
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User user = userRepository.findByEmail(req.email()).orElseThrow();
        String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        ));
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }
}
