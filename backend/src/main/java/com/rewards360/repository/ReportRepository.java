package com.rewards360.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rewards360.model.Report;

import org.springframework.stereotype.Repository;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> { }
