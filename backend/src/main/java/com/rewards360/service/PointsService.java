package com.rewards360.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rewards360.dto.ClaimRequest;
import com.rewards360.dto.RedeemRequest;
import com.rewards360.exception.InsufficientPointsException;
import com.rewards360.exception.OfferNotFoundException;
import com.rewards360.model.Offer;
import com.rewards360.model.Redemption;
import com.rewards360.model.Transaction;
import com.rewards360.model.User;
import com.rewards360.repository.OfferRepository;
import com.rewards360.repository.RedemptionRepository;
import com.rewards360.repository.TransactionRepository;
import com.rewards360.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointsService {

    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final TransactionRepository transactionRepository;
    private final RedemptionRepository redemptionRepository;
    private final TransactionService transactionService;

    // Claim points for user
    @Transactional
    public Transaction claimPoints(User user, ClaimRequest request) {
        // Create new transaction
        Transaction transaction = new Transaction();
        transaction.setExternalId("CLAIM-" + System.currentTimeMillis());
        transaction.setType("CLAIM");
        transaction.setPointsEarned(request.points());
        transaction.setPointsRedeemed(0);
        transaction.setStore("Online");
        transaction.setDate(LocalDate.now());
        transaction.setExpiry(LocalDate.now().plusMonths(3));
        transaction.setNote(request.note());
        transaction.setUser(user);

        // Update user points balance
        int currentPoints = user.getProfile().getPointsBalance();
        int newPoints = currentPoints + request.points();
        user.getProfile().setPointsBalance(newPoints);

        // Update lifetime points
        int lifetimePoints = user.getProfile().getLifetimePoints();
        user.getProfile().setLifetimePoints(lifetimePoints + request.points());

        // Tier will be automatically updated by JPA @PreUpdate callback in CustomerProfile

        // Save transaction and update user
        transactionRepository.save(transaction);
        userRepository.save(user);
        
        // Run fraud detection on the transaction
        transactionService.processTransaction(transaction.getId());

        return transaction;
    }

    // Redeem offer for user
    @Transactional
    public Redemption redeemOffer(User user, RedeemRequest request) {
        // Find offer
        Offer offer = offerRepository.findById(request.offerId())
                .orElseThrow(() -> new OfferNotFoundException("Offer not found with id: " + request.offerId()));

        // Check if user has enough points
        int userPoints = user.getProfile().getPointsBalance();
        int offerCost = offer.getCostPoints();
        
        if (userPoints < offerCost) {
            throw new InsufficientPointsException("Not enough points. You have " + userPoints + 
                                                  " but need " + offerCost + " points");
        }

        // Deduct points from user
        int newPoints = userPoints - offerCost;
        user.getProfile().setPointsBalance(newPoints);

        // Note: Tier is based on lifetime points and is automatically updated by JPA @PreUpdate callback
        // Tier doesn't decrease when spending points (only increases when earning)

        // Create redemption transaction
        Transaction transaction = new Transaction();
        transaction.setExternalId("RED-" + System.currentTimeMillis());
        transaction.setType("REDEMPTION");
        transaction.setPointsEarned(0);
        transaction.setPointsRedeemed(offerCost);
        transaction.setStore(request.store());
        transaction.setDate(LocalDate.now());
        transaction.setNote(offer.getTitle());
        transaction.setUser(user);
        
        transactionRepository.save(transaction);
        
        // Run fraud detection on the redemption transaction
        transactionService.processTransaction(transaction.getId());

        // Create redemption record
        Redemption redemption = new Redemption();
        redemption.setTransactionId(transaction.getExternalId());
        redemption.setConfirmationCode("CONF-" + System.currentTimeMillis());
        redemption.setDate(LocalDate.now());
        redemption.setCostPoints(offerCost);
        redemption.setOfferTitle(offer.getTitle());
        redemption.setStore(request.store());
        redemption.setUser(user);

        redemptionRepository.save(redemption);
        userRepository.save(user);

        return redemption;
    }
}