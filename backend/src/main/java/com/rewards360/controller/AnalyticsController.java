package com.rewards360.controller;
 
import java.util.List;
 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
 
import com.rewards360.dto.KPIResponse;
import com.rewards360.dto.ReportResponse;
import com.rewards360.dto.TrendResponse;
import com.rewards360.model.Offer;
import com.rewards360.model.Redemption;
import com.rewards360.model.Report;
import com.rewards360.model.User;
// Repositories are accessed in services; controllers use AnalyticsService only
import com.rewards360.service.AnalyticsService;
 
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
 
    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }
 
    @GetMapping("/kpis")
    public KPIResponse getKPIs() {
        return service.getKPIs();
    }
 
    @GetMapping("/trends")
    public TrendResponse getTrends(@RequestParam("metric") String metric) {
        return service.getTrend(metric);
    }
 
    @GetMapping("/report")
    public ReportResponse getReport(@RequestParam("metric") String metric,
                                    @RequestParam("start") String start,
                                    @RequestParam("end") String end) {
        return service.generateReport(metric, start, end);
    }
 
    @GetMapping("/reports")
    public List<Report> getReportsHistory() {
        return service.getReportsHistory();
    }
 
    // ✅ Users history endpoint
    @GetMapping("/users")
    public List<User> getUsersHistory() {
        return service.getUsersHistory();
    }
 
    // ✅ Offers history endpoint
    @GetMapping("/offers")
    public List<Offer> getOffersHistory() {
        return service.getOffersHistory();
    }
 
    // ✅ Redemptions history endpoint
    @GetMapping("/redemptions")
    public List<Redemption> getRedemptionsHistory() {
        return service.getRedemptionsHistory();
    }
}
 
 