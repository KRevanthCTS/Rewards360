package com.rewards360.repository;

import com.rewards360.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Simple filters
    List<Transaction> findTop100ByOrderByCreatedAtDesc();
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(String accountId);
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.user WHERE t.riskLevel = :riskLevel ORDER BY t.createdAt DESC")
    List<Transaction> findByRiskLevelOrderByCreatedAtDesc(@Param("riskLevel") String riskLevel);
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.user WHERE t.status = :status ORDER BY t.createdAt DESC")
    List<Transaction> findByStatusOrderByCreatedAtDesc(@Param("status") String status);
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.user WHERE t.status IN :statuses ORDER BY t.createdAt DESC")
    List<Transaction> findByStatusInOrderByCreatedAtDesc(@Param("statuses") List<String> statuses);
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.user WHERE t.status = :status AND t.riskLevel = :riskLevel ORDER BY t.createdAt DESC")
    List<Transaction> findByStatusAndRiskLevelOrderByCreatedAtDesc(@Param("status") String status, @Param("riskLevel") String riskLevel);
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.user WHERE t.id = :id")
    Optional<Transaction> findByIdWithUser(@Param("id") Long id);
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.user ORDER BY t.createdAt DESC")
    List<Transaction> findAllByOrderByCreatedAtDesc();
    List<Transaction> findByPaymentMethodOrderByCreatedAtDesc(String paymentMethod);

    // Ranges
    List<Transaction> findByCreatedAtBetweenOrderByCreatedAtDesc(Instant from, Instant to);

    // Recent slice
    List<Transaction> findByCreatedAtAfterOrderByCreatedAtDesc(Instant after);

    // Text search (description)
    @Query("""
           SELECT t FROM Transaction t
           WHERE LOWER(t.description) LIKE LOWER(CONCAT('%', :q, '%'))
           ORDER BY t.createdAt DESC
           """)
    List<Transaction> searchByText(@Param("q") String q);

    // Combined commonly-used queries (optional)
    @Query("""
           SELECT t FROM Transaction t
           WHERE (:accountId IS NULL OR t.accountId = :accountId)
             AND (:risk IS NULL OR t.riskLevel = :risk)
             AND (:status IS NULL OR t.status = :status)
             AND (:pm IS NULL OR t.paymentMethod = :pm)
             AND (:fromTs IS NULL OR t.createdAt >= :fromTs)
             AND (:toTs IS NULL OR t.createdAt <= :toTs)
             AND (
                 :q IS NULL OR
                 LOWER(t.description) LIKE LOWER(CONCAT('%', :q, '%'))
             )
           ORDER BY t.createdAt DESC
           """)
    List<Transaction> findFiltered(@Param("accountId") String accountId,
                                   @Param("risk") String risk,
                                   @Param("status") String status,
                                   @Param("pm") String pm,
                                   @Param("fromTs") Instant fromTs,
                                   @Param("toTs") Instant toTs,
                                   @Param("q") String q);

    List<Transaction> findTop10ByAccountIdOrderByCreatedAtDesc(String accountId);

    // Velocity: count transactions within a window
    @Query("""
       SELECT COUNT(t.id)
       FROM Transaction t
       WHERE t.accountId = :accountId
         AND t.createdAt BETWEEN :fromTs AND :toTs
       """)
    long countByAccountIdAndCreatedAtBetween(@Param("accountId") String accountId,
                                             @Param("fromTs") Instant fromTs,
                                             @Param("toTs") Instant toTs);

    // For rewards system - find transactions by user
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    // For fraud detection - find recent transactions by account
    List<Transaction> findByAccountIdAndCreatedAtAfter(String accountId, Instant after);
    
    // For fraud rules - find recent redemptions by user and type
    @Query("""
           SELECT t FROM Transaction t
           WHERE t.user = :user
             AND t.type = :type
             AND t.createdAt >= :after
           ORDER BY t.createdAt DESC
           """)
    List<Transaction> findByUserAndTypeAndCreatedAtAfter(@Param("user") com.rewards360.model.User user,
                                                          @Param("type") String type,
                                                          @Param("after") Instant after);
    
    // For fraud rules - find recent transactions by user (for location check)
    List<Transaction> findTop5ByUserOrderByCreatedAtDesc(com.rewards360.model.User user);
}