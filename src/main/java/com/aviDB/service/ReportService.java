package com.aviDB.service;

import com.aviDB.domain.user.Report;
import com.aviDB.domain.user.User;
import com.aviDB.exception.NotFoundException;
import com.aviDB.repository.ReportRepository;
import com.aviDB.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    // Constructor injection for ReportRepository
    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    // Find all reports for a given user
    public List<Report> getReportsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return reportRepository.findByUser(user);
    }

    // Add a report record to the database
    public Report addReport(Report report) {
        return reportRepository.save(report);
    }

    // Update an existing report record
    public Report updateReport(Report report) {
        return reportRepository.save(report);
    }

    // Delete a report record
    public void deleteReport(Long reportId) {
        reportRepository.deleteById(reportId);
    }
}
