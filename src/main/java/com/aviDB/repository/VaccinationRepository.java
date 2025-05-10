package com.aviDB.repository;

import com.aviDB.domain.user.Vaccination;
import com.aviDB.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {

    // Find all vaccinations for a given user
    @Query("SELECT v FROM Vaccination v WHERE v.user.id = ?1")
    List<Vaccination> findByUser(User user);

}
