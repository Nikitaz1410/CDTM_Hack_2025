package com.aviDB.repository;


import com.aviDB.domain.user.Blood;
import com.aviDB.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloodRepository extends JpaRepository<Blood, Long> {

    // Option 1: If you want to use User object
    @Query("SELECT b FROM Blood b WHERE b.user = :user")
    List<Blood> findByUser(@Param("user") User user);

    // Option 2: If you want to use user ID directly
    @Query("SELECT b FROM Blood b WHERE b.user.id = :userId")
    List<Blood> findByUserId(@Param("userId") Long userId);
}
