package com.aviDB.repository;

import com.aviDB.domain.user.Report;
import com.aviDB.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Find all reports for a given user
    @Query("SELECT r FROM Report r WHERE r.user = ?1")
    List<Report> findByUser(User user);

}
