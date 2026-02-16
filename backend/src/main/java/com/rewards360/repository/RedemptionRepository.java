
package com.rewards360.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rewards360.model.Redemption;
import com.rewards360.model.User;

public interface RedemptionRepository extends JpaRepository<Redemption, Long> {
    List<Redemption> findByUser(User user);
    
    List<Redemption> findByUserId(Long userId);
    // or with sorting:
    List<Redemption> findByUserIdOrderByDateDesc(Long userId);
    List<Redemption> findByDateBetween(LocalDate start, LocalDate end);
}
