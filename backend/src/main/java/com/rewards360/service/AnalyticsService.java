package com.rewards360.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.rewards360.dto.KPIResponse;
import com.rewards360.dto.ReportResponse;
import com.rewards360.dto.TrendResponse;
import com.rewards360.model.Offer;
import com.rewards360.model.Redemption;
import com.rewards360.model.Report;
import com.rewards360.model.User;
import com.rewards360.repository.OfferRepository;
import com.rewards360.repository.RedemptionRepository;
import com.rewards360.repository.ReportRepository;
import com.rewards360.repository.UserRepository;

@Service
public class AnalyticsService {
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    private final UserRepository userRepo;
    private final OfferRepository offerRepo;
    private final RedemptionRepository redemptionRepo;
    private final ReportRepository reportRepo;

    public AnalyticsService(UserRepository userRepo, OfferRepository offerRepo,
                            RedemptionRepository redemptionRepo, ReportRepository reportRepo) {
        this.userRepo = userRepo;
        this.offerRepo = offerRepo;
        this.redemptionRepo = redemptionRepo;
        this.reportRepo = reportRepo;
    }

    // KPIs
    public KPIResponse getKPIs() {
        try {
            long users = userRepo.count();
            long offers = offerRepo.count();
            long redemptions = redemptionRepo.count();

            double rate = users > 0 ? (double) redemptions / users * 100 : 0;

            return new KPIResponse(users, offers, redemptions, rate);
        } catch (Exception ex) {
            // Log the full exception for server-side debugging and return a safe default
            logger.error("Error while fetching KPIs", ex);
            return new KPIResponse(0L, 0L, 0L, 0.0);
        }
    }

    // Trends
    public TrendResponse getTrend(String metric) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        switch (metric.toLowerCase()) {
            case "users":
                Map<YearMonth, Long> usersByMonth = userRepo.findAll().stream()
                        .collect(Collectors.groupingBy(
                                u -> YearMonth.from(u.getCreatedAt()),
                                Collectors.counting()
                        ));
                List<YearMonth> sortedUserMonths = usersByMonth.keySet().stream().sorted().toList();
                return new TrendResponse(
                        sortedUserMonths.stream().map(m -> m.format(formatter)).toList(),
                        sortedUserMonths.stream().map(usersByMonth::get).toList()
                );

            case "offers":
                Map<YearMonth, Long> offersByMonth = offerRepo.findAll().stream()
                        .collect(Collectors.groupingBy(
                                o -> YearMonth.from(o.getStartDate()),
                                Collectors.counting()
                        ));
                List<YearMonth> sortedOfferMonths = offersByMonth.keySet().stream().sorted().toList();
                return new TrendResponse(
                        sortedOfferMonths.stream().map(m -> m.format(formatter)).toList(),
                        sortedOfferMonths.stream().map(offersByMonth::get).toList()
                );

            case "redemption":
                Map<YearMonth, Long> redemptionsByMonth = redemptionRepo.findAll().stream()
                        .collect(Collectors.groupingBy(
                                r -> YearMonth.from(r.getDate()),
                                Collectors.counting()
                        ));
                List<YearMonth> sortedRedemptionMonths = redemptionsByMonth.keySet().stream().sorted().toList();
                return new TrendResponse(
                        sortedRedemptionMonths.stream().map(m -> m.format(formatter)).toList(),
                        sortedRedemptionMonths.stream().map(redemptionsByMonth::get).toList()
                );

            default:
                return new TrendResponse(List.of(), List.of());
        }
    }

    // Reports
    public ReportResponse generateReport(String metric, String start, String end) {
        LocalDate s = LocalDate.parse(start);
        LocalDate e = LocalDate.parse(end);

        Report report = new Report();
        report.setMetric(metric);
        report.setDateRange(start + " → " + end);
        report.setGeneratedAt(LocalDateTime.now());
        reportRepo.save(report);

        switch (metric.toLowerCase()) {
            case "users":
                long userCount = userRepo.count();
                return new ReportResponse(metric, start, end,
                        List.of("Total Users"), List.of((int) userCount));

            case "offers":
                long offerCount = offerRepo.count();
                return new ReportResponse(metric, start, end,
                        List.of("Total Offers"), List.of((int) offerCount));

            case "redemption":
                List<Redemption> redemptions = redemptionRepo.findByDateBetween(s, e);
                List<String> labels = redemptions.stream().map(r -> r.getDate().toString()).toList();
                List<Integer> values = redemptions.stream().map(Redemption::getCostPoints).toList();
                return new ReportResponse(metric, start, end, labels, values);

            default:
                return new ReportResponse(metric, start, end, List.of(), List.of());
        }
    }

    public List<Report> getReportsHistory() {
        return reportRepo.findAll();
    }

    // ✅ Users history
    public List<User> getUsersHistory() {
        return userRepo.findAll();
    }

    // ✅ Offers history
    public List<Offer> getOffersHistory() {
        return offerRepo.findAll();
    }

    // ✅ Redemptions history
    public List<Redemption> getRedemptionsHistory() {
        return redemptionRepo.findAll();
    }
}
