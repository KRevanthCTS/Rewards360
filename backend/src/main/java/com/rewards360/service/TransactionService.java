package com.rewards360.service;

import com.rewards360.model.Transaction;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Consolidated Transaction Service
 * Handles all transaction operations including CRUD, rules, actions, and fraud detection
 */
public interface TransactionService {
    
    // CRUD Operations
    List<Transaction> list(String accountId, String riskLevel, String status, String paymentMethod,
                          Instant from, Instant to, String q);
    Optional<Transaction> get(Long id);
    Transaction create(Transaction tx);
    Optional<Transaction> updateStatus(Long id, String newStatus);
    
    // Action Operations
    Transaction markForReview(Long transactionId, String userId, String username, String reason);
    Transaction blockTransaction(Long transactionId, String userId, String username, String reason);
    Transaction clearTransaction(Long transactionId, String userId, String username, String reason);
    void bulkMarkForReview(Long[] transactionIds, String userId, String username, String reason);
    void bulkBlockTransactions(Long[] transactionIds, String userId, String username, String reason);
    
    // Rule & Anomaly Detection
    void processTransaction(Long transactionId);
    void reprocessAllTransactions();
}
