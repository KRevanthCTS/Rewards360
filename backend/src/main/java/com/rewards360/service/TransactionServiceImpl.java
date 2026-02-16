// package com.rewards360.service;

// import com.rewards360.model.Transaction;
// import com.rewards360.repository.TransactionRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
// import java.time.Instant;
// import java.util.List;
// import java.util.Optional;

// @Service
// @RequiredArgsConstructor
// public class TransactionServiceImpl implements TransactionService {
    
//     private final TransactionRepository transactionRepository;
    
//     @Override
//     public List<Transaction> list(String accountId, String riskLevel, String status, String paymentMethod,
//                                    Instant from, Instant to, BigDecimal minAmount, BigDecimal maxAmount, String q) {
//         return transactionRepository.findFiltered(accountId, riskLevel, status, paymentMethod, from, to, minAmount, maxAmount, q);
//     }
    
//     @Override
//     public Optional<Transaction> get(Long id) {
//         return transactionRepository.findById(id);
//     }
    
//     @Override
//     @Transactional
//     public Transaction create(Transaction tx) {
//         return transactionRepository.save(tx);
//     }
    
//     @Override
//     @Transactional
//     public Optional<Transaction> updateStatus(Long id, String newStatus) {
//         Optional<Transaction> txOpt = transactionRepository.findById(id);
//         if (txOpt.isPresent()) {
//             Transaction tx = txOpt.get();
//             tx.setStatus(newStatus);
//             return Optional.of(transactionRepository.save(tx));
//         }
//         return Optional.empty();
//     }
    
//     @Override
//     @Transactional
//     public Transaction markForReview(Long transactionId, String userId, String username, String reason) {
//         Transaction tx = transactionRepository.findById(transactionId)
//             .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
//         tx.setStatus("REVIEW");
//         tx.setRiskLevel("HIGH");
//         return transactionRepository.save(tx);
//     }
    
//     @Override
//     @Transactional
//     public Transaction blockTransaction(Long transactionId, String userId, String username, String reason) {
//         Transaction tx = transactionRepository.findById(transactionId)
//             .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
//         tx.setStatus("BLOCKED");
//         tx.setRiskLevel("CRITICAL");
//         return transactionRepository.save(tx);
//     }
    
//     @Override
//     @Transactional
//     public Transaction clearTransaction(Long transactionId, String userId, String username, String reason) {
//         Transaction tx = transactionRepository.findById(transactionId)
//             .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
//         tx.setStatus("APPROVED");
//         tx.setRiskLevel("LOW");
//         return transactionRepository.save(tx);
//     }
    
//     @Override
//     @Transactional
//     public void bulkMarkForReview(Long[] transactionIds, String userId, String username, String reason) {
//         for (Long id : transactionIds) {
//             markForReview(id, userId, username, reason);
//         }
//     }
    
//     @Override
//     @Transactional
//     public void bulkBlockTransactions(Long[] transactionIds, String userId, String username, String reason) {
//         for (Long id : transactionIds) {
//             blockTransaction(id, userId, username, reason);
//         }
//     }
    
//     @Override
//     @Transactional
//     public void processTransaction(Long transactionId) {
//         Transaction tx = transactionRepository.findById(transactionId)
//             .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
        
//         // Apply fraud detection rules
//         applyFraudRules(tx);
        
//         transactionRepository.save(tx);
//     }
    
//     /**
//      * Apply fraud detection rules to a transaction
//      */
//     private void applyFraudRules(Transaction tx) {
//         // Rule 1: Check if redeemed points > available points (insufficient balance)
//         if (tx.getPointsRedeemed() != null && tx.getPointsRedeemed() > 0) {
//             if (tx.getUser() != null && tx.getUser().getProfile() != null) {
//                 int availablePoints = tx.getUser().getProfile().getPointsBalance();
//                 if (tx.getPointsRedeemed() > availablePoints) {
//                     tx.setRiskLevel("CRITICAL");
//                     tx.setStatus("BLOCKED");
//                     tx.setDescription("Blocked: Insufficient points balance");
//                     return;
//                 }
//             }
//         }
        
//         // Rule 2: Check for more than 5 redemptions in 10 minutes (velocity check)
//         if (tx.getType() != null && tx.getType().equals("REDEMPTION")) {
//             if (tx.getUser() != null) {
//                 Instant tenMinutesAgo = Instant.now().minusSeconds(600);
//                 List<Transaction> recentRedemptions = transactionRepository
//                     .findByUserAndTypeAndCreatedAtAfter(tx.getUser(), "REDEMPTION", tenMinutesAgo);
                
//                 if (recentRedemptions.size() >= 5) {
//                     tx.setRiskLevel("HIGH");
//                     tx.setStatus("REVIEW");
//                     tx.setDescription("Flagged: Multiple redemptions in short time (>5 in 10 min)");
//                     return;
//                 }
//             }
//         }
        
//         // Rule 3: Check if login from different country (location mismatch)
//         if (tx.getLocation() != null && tx.getUser() != null) {
//             String currentCountry = extractCountry(tx.getLocation());
            
//             // Get user's last known location from recent transactions
//             List<Transaction> recentTransactions = transactionRepository
//                 .findTop5ByUserOrderByCreatedAtDesc(tx.getUser());
            
//             if (!recentTransactions.isEmpty()) {
//                 String previousCountry = extractCountry(recentTransactions.get(0).getLocation());
                
//                 if (previousCountry != null && !previousCountry.equals(currentCountry)) {
//                     tx.setRiskLevel("HIGH");
//                     tx.setStatus("REVIEW");
//                     tx.setDescription("Flagged: Transaction from different country (" + currentCountry + ")");
//                     return;
//                 }
//             }
//         }
        
//         // Default: No fraud detected, clear the transaction
//         if (tx.getRiskLevel() == null) {
//             tx.setRiskLevel("LOW");
//         }
//         if (tx.getStatus() == null || tx.getStatus().isEmpty()) {
//             tx.setStatus("CLEARED");
//         }
//     }
    
//     /**
//      * Extract country code from location string (e.g., "Pune, IN" -> "IN")
//      */
//     private String extractCountry(String location) {
//         if (location == null || location.trim().isEmpty()) {
//             return null;
//         }
//         String[] parts = location.split(",");
//         if (parts.length > 1) {
//             return parts[parts.length - 1].trim().toUpperCase();
//         }
//         return location.trim().toUpperCase();
//     }
    
//     @Override
//     @Transactional
//     public void reprocessAllTransactions() {
//         // Reprocess all transactions for fraud detection
//         // Placeholder for now
//     }
// }


















package com.rewards360.service;

import com.rewards360.model.Transaction;
import com.rewards360.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    
    @Override
    public List<Transaction> list(String accountId, String riskLevel, String status, String paymentMethod,
                                   Instant from, Instant to, String q) {
        return transactionRepository.findFiltered(accountId, riskLevel, status, paymentMethod, from, to, q);
    }
    
    @Override
    public Optional<Transaction> get(Long id) {
        return transactionRepository.findById(id);
    }
    
    @Override
    @Transactional
    public Transaction create(Transaction tx) {
        return transactionRepository.save(tx);
    }
    
    @Override
    @Transactional
    public Optional<Transaction> updateStatus(Long id, String newStatus) {
        Optional<Transaction> txOpt = transactionRepository.findById(id);
        if (txOpt.isPresent()) {
            Transaction tx = txOpt.get();
            tx.setStatus(newStatus);
            return Optional.of(transactionRepository.save(tx));
        }
        return Optional.empty();
    }
    
    @Override
    @Transactional
    public Transaction markForReview(Long transactionId, String userId, String username, String reason) {
        Transaction tx = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
        tx.setStatus("REVIEW");
        tx.setRiskLevel("HIGH");
        return transactionRepository.save(tx);
    }
    
    @Override
    @Transactional
    public Transaction blockTransaction(Long transactionId, String userId, String username, String reason) {
        Transaction tx = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
        tx.setStatus("BLOCKED");
        tx.setRiskLevel("CRITICAL");
        return transactionRepository.save(tx);
    }
    
    @Override
    @Transactional
    public Transaction clearTransaction(Long transactionId, String userId, String username, String reason) {
        Transaction tx = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
        tx.setStatus("APPROVED");
        tx.setRiskLevel("LOW");
        Transaction savedTx = transactionRepository.save(tx);
        // Ensure user is loaded for serialization
        if (savedTx.getUser() != null) {
            savedTx.getUser().getId(); // Trigger lazy loading
        }
        return savedTx;
    }
    
    @Override
    @Transactional
    public void bulkMarkForReview(Long[] transactionIds, String userId, String username, String reason) {
        for (Long id : transactionIds) {
            markForReview(id, userId, username, reason);
        }
    }
    
    @Override
    @Transactional
    public void bulkBlockTransactions(Long[] transactionIds, String userId, String username, String reason) {
        for (Long id : transactionIds) {
            blockTransaction(id, userId, username, reason);
        }
    }
    
    @Override
    @Transactional
    public void processTransaction(Long transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
        
        // Apply fraud detection rules
        applyFraudRules(tx);
        
        transactionRepository.save(tx);
    }
    
    /**
     * Apply fraud detection rules to a transaction
     */
    private void applyFraudRules(Transaction tx) {
        // Rule 1: Check if redeemed points > available points (insufficient balance)
        if (tx.getPointsRedeemed() != null && tx.getPointsRedeemed() > 0) {
            if (tx.getUser() != null && tx.getUser().getProfile() != null) {
                int availablePoints = tx.getUser().getProfile().getPointsBalance();
                if (tx.getPointsRedeemed() > availablePoints) {
                    tx.setRiskLevel("CRITICAL");
                    tx.setStatus("BLOCKED");
                    tx.setDescription("Blocked: Insufficient points balance");
                    return;
                }
            }
        }
        
        // Rule 2: Check for more than 5 redemptions in 10 minutes (velocity check)
        if (tx.getType() != null && tx.getType().equals("REDEMPTION")) {
            if (tx.getUser() != null) {
                Instant tenMinutesAgo = Instant.now().minusSeconds(600);
                List<Transaction> recentRedemptions = transactionRepository
                    .findByUserAndTypeAndCreatedAtAfter(tx.getUser(), "REDEMPTION", tenMinutesAgo);
                
                if (recentRedemptions.size() >= 5) {
                    tx.setRiskLevel("HIGH");
                    tx.setStatus("REVIEW");
                    tx.setDescription("Flagged: Multiple redemptions in short time (>5 in 10 min)");
                    return;
                }
            }
        }
        
        // Default: No fraud detected, clear the transaction
        if (tx.getRiskLevel() == null) {
            tx.setRiskLevel("LOW");
        }
        if (tx.getStatus() == null || tx.getStatus().isEmpty()) {
            tx.setStatus("CLEARED");
        }
    }
    
    @Override
    @Transactional
    public void reprocessAllTransactions() {
        // Reprocess all transactions for fraud detection
        // Placeholder for now
    }
}
