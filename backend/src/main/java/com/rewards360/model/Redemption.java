package com.rewards360.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "redemption")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Redemption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "confirmation_code", unique = true, nullable = false, length = 50)
    private String confirmationCode;
    
    @Column(name = "transaction_id", nullable = false, length = 50)
    private String transactionId;
    
    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    @Column(name = "cost_points", nullable = false)
    private int costPoints;
    
    @Column(name = "offer_title", nullable = false, length = 200)
    private String offerTitle;
    
    @Column(name = "store", length = 100)
    private String store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
}
