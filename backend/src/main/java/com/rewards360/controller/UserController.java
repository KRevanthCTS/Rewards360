package com.rewards360.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rewards360.dto.ClaimRequest;
import com.rewards360.dto.RedeemRequest;
import com.rewards360.dto.UpdateProfileRequest;
import com.rewards360.model.CustomerProfile;
import com.rewards360.exception.UserNotFoundException;
import com.rewards360.model.Offer;
import com.rewards360.model.Redemption;
import com.rewards360.model.Transaction;
import com.rewards360.model.User;
import com.rewards360.repository.OfferRepository;
import com.rewards360.repository.RedemptionRepository;
import com.rewards360.repository.TransactionRepository;
import com.rewards360.repository.UserRepository;
import com.rewards360.service.PointsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final TransactionRepository transactionRepository;
    private final RedemptionRepository redemptionRepository;
    private final PointsService pointsService;

    // Get current user from authentication
    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    // Get user profile
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(user);
    }

    // Get all offers
    @GetMapping("/offers")
    public ResponseEntity<List<Offer>> getAllOffers() {
        List<Offer> offers = offerRepository.findAll();
        return ResponseEntity.ok(offers);
    }
    
    // Get offers based on user tier
    @GetMapping("/offers/my-tier")
    public ResponseEntity<List<Offer>> getOffersForMyTier(Authentication auth) {
        User user = getCurrentUser(auth);
        String userTier = user.getProfile().getLoyaltyTier();
        List<Offer> offers = offerRepository.findAvailableOffersForTier(userTier);
        return ResponseEntity.ok(offers);
    }

    // Claim points
    @PostMapping("/claim")
    public ResponseEntity<Transaction> claimPoints(@RequestBody ClaimRequest request, Authentication auth) {
        User user = getCurrentUser(auth);
        Transaction transaction = pointsService.claimPoints(user, request);
        return ResponseEntity.ok(transaction);
    }

    // Redeem offer
    @PostMapping("/redeem")
    public ResponseEntity<Redemption> redeemOffer(@RequestBody RedeemRequest request, Authentication auth) {
        User user = getCurrentUser(auth);
        Redemption redemption = pointsService.redeemOffer(user, request);
        return ResponseEntity.ok(redemption);
    }

    // Get user transactions
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getMyTransactions(Authentication auth) {
        User user = getCurrentUser(auth);
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(user.getId());
        return ResponseEntity.ok(transactions);
    }

    // Get user redemptions
    @GetMapping("/redemptions")
    public ResponseEntity<List<Redemption>> getMyRedemptions(Authentication auth) {
        User user = getCurrentUser(auth);
        List<Redemption> redemptions = redemptionRepository.findByUserIdOrderByDateDesc(user.getId());
        return ResponseEntity.ok(redemptions);
    }

    // Update profile (safe subset)
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileRequest req, Authentication auth){
        User user = getCurrentUser(auth);
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());

        CustomerProfile profile = user.getProfile();
        if (profile == null) {
            profile = new CustomerProfile();
            profile.setUser(user);
            profile.setPointsBalance(0);
            profile.setLifetimePoints(0);
            profile.setLoyaltyTier("Bronze");
        }
        if (req.getPreferences() != null) profile.setPreferences(req.getPreferences());
        if (req.getCommunication() != null) profile.setCommunication(req.getCommunication());

        user.setProfile(profile);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }
}
