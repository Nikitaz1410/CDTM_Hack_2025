package com.aviDB.api.controller;

import com.aviDB.domain.user.Report;
import com.aviDB.service.ReportService;

import com.aviDB.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    // Get all reports for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Report>> getReportsForUser(@PathVariable Long userId) {
        List<Report> reports = reportService.getReportsByUser(userId);
        return ResponseEntity.ok(reports);
    }

    // Add a new report for a user
    @PostMapping("/user/{userId}")
    public ResponseEntity<Report> addReport(
            @PathVariable Long userId,
            @Valid @RequestBody Report report
    ) {
        // Attach user to the report if needed
        // (assuming user is already set via frontend or requires linking here)
        report.setUser(userService.getUserById(userId));
        Report createdReport = reportService.addReport(report);
        return ResponseEntity.ok(createdReport);
    }

    // Update an existing report record
    @PutMapping("/{reportId}")
    public ResponseEntity<Report> updateReport(
            @PathVariable Long reportId,
            @Valid @RequestBody Report report
    ) {
        report.setId(reportId); // ensure ID is set
        Report updatedReport = reportService.updateReport(report);
        return ResponseEntity.ok(updatedReport);
    }

    // Delete a report record by its ID
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }
}
