
package com.rewards360.controller;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rewards360.dto.OfferAnalyticsDto;
import com.rewards360.exception.OfferNotFoundException;
import com.rewards360.model.Campaign;
import com.rewards360.model.Offer;
import com.rewards360.model.Transaction;
import com.rewards360.repository.CampaignRepository;
import com.rewards360.repository.OfferRepository;
import com.rewards360.repository.TransactionRepository;
import com.rewards360.service.TransactionService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {
    private final CampaignRepository campaignRepository;
    private final OfferRepository offerRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    @PostMapping("/campaigns")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Campaign> createCampaign(@RequestBody Campaign c) {
        return ResponseEntity.ok(campaignRepository.save(c));
    }

    @GetMapping("/campaigns")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Campaign> campaigns() {
        return campaignRepository.findAll();
    }

    @PostMapping("/offers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Offer> createOffer(@RequestBody Offer o) {
        o.setActive(true);
        return ResponseEntity.ok(offerRepository.save(o));
    }

    @PutMapping("/offers/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Offer> toggleOffer(@PathVariable Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new OfferNotFoundException("Offer not found: " + id));
        offer.setActive(!offer.isActive());
        Offer saved = offerRepository.save(offer);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/offers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        if (!offerRepository.existsById(id)) {
            throw new OfferNotFoundException("Offer not found: " + id);
        }
        offerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/offers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Offer> offers() {
        return offerRepository.findAll();
    }

    // Fraud monitoring endpoints
    @GetMapping("/fraud/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getFraudTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String riskLevel) {
        List<Transaction> transactions;
        if (status != null && !status.isEmpty()) {
            if (riskLevel != null && !riskLevel.isEmpty()) {
                // Filter by both status and risk level
                transactions = transactionRepository.findByStatusAndRiskLevelOrderByCreatedAtDesc(status, riskLevel);
            } else {
                transactions = transactionRepository.findByStatusOrderByCreatedAtDesc(status);
            }
        } else if (riskLevel != null && !riskLevel.isEmpty()) {
            // Filter by risk level only
            transactions = transactionRepository.findByRiskLevelOrderByCreatedAtDesc(riskLevel);
        } else {
            // Show only suspicious transactions by default (REVIEW, BLOCKED, or high risk)
            transactions = transactionRepository.findByStatusInOrderByCreatedAtDesc(
                Arrays.asList("REVIEW", "BLOCKED"));
        }

        // Convert to simple maps to avoid Hibernate proxy serialization issues
        List<Map<String, Object>> result = transactions.stream().map(tx -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", tx.getId());
            map.put("transactionId", tx.getTransactionId());
            map.put("externalId", tx.getExternalId());
            map.put("status", tx.getStatus());
            map.put("riskLevel", tx.getRiskLevel());
            map.put("description", tx.getDescription());
            map.put("type", tx.getType());
            map.put("pointsEarned", tx.getPointsEarned());
            map.put("pointsRedeemed", tx.getPointsRedeemed());
            map.put("store", tx.getStore());
            map.put("date", tx.getDate());
            map.put("expiry", tx.getExpiry());
            map.put("note", tx.getNote());
            map.put("createdAt", tx.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/fraud/transactions/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> blockTransaction(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Blocked by admin");
        transactionService.blockTransaction(id, "admin", "admin", reason);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Transaction blocked successfully");
        response.put("transactionId", id);
        response.put("status", "BLOCKED");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/fraud/transactions/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> approveTransaction(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Approved by admin");
        transactionService.clearTransaction(id, "admin", "admin", reason);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Transaction approved successfully");
        response.put("transactionId", id);
        response.put("status", "APPROVED");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public List<OfferAnalyticsDto> analytics() {
        return offerRepository.findAll()
                .stream()
                .map(o -> OfferAnalyticsDto.builder()
                        .id(o.getId())
                        .title(o.getTitle())
                        .category(o.getCategory())
                        .costPoints(o.getCostPoints())
                        .build())
                .collect(Collectors.toList());
    }
}
