// src/main/java/com/aviDB/repository/MedsRepository.java
package com.aviDB.repository;

import com.aviDB.domain.user.Med;
import com.aviDB.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedsRepository extends JpaRepository<Med, Long> {

    // Find all meds by user
    @Query("SELECT m FROM Med m WHERE m.user = ?1")
    List<Med> findByUser(User user);

    // Find meds by user ID
    @Query("SELECT m FROM Med m WHERE m.user.id = ?1")
    List<Med> findByUserId(Long userId);

}

