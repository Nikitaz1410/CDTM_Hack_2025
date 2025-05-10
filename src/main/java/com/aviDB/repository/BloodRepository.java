package com.aviDB.repository;


import com.aviDB.domain.user.Blood;
import com.aviDB.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloodRepository extends JpaRepository<Blood, Long> {

    // Find all tests for a given user
    @Query("SELECT b FROM Blood b WHERE b.user = ?1")
    List<Blood> findByUser(User user);
}
