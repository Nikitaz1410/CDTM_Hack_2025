package com.aviDB.api.controller;

import com.aviDB.domain.user.Vaccination;
import com.aviDB.service.VaccinationService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
public class VaccinationController {

    @Autowired
    private VaccinationService vaccinationService;

    // Get all vaccinations for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Vaccination>> getVaccinationsForUser(@PathVariable Long userId) {
        List<Vaccination> vaccinations = vaccinationService.getVaccinationsByUser(userId);
        return ResponseEntity.ok(vaccinations);
    }

    // Add a new vaccination for a user
    @PostMapping("/user/{userId}")
    public ResponseEntity<Vaccination> addVaccination(
            @PathVariable Long userId,
            @Valid @RequestBody Vaccination vaccination
    ) {
        Vaccination createdVaccination = vaccinationService.addVaccination(vaccination);
        return ResponseEntity.ok(createdVaccination);
    }

    // Update an existing vaccination record
    @PutMapping("/{vaccinationId}")
    public ResponseEntity<Vaccination> updateVaccination(
            @PathVariable Long vaccinationId,
            @Valid @RequestBody Vaccination vaccination
    ) {
        Vaccination updatedVaccination = vaccinationService.updateVaccination(vaccination);
        return ResponseEntity.ok(updatedVaccination);
    }

    // Delete a vaccination record by its ID
    @DeleteMapping("/{vaccinationId}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long vaccinationId) {
        vaccinationService.deleteVaccination(vaccinationId);
        return ResponseEntity.noContent().build();
    }
}
