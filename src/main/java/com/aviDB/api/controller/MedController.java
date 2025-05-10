package com.aviDB.api.controller;

import com.aviDB.domain.user.Med;
import com.aviDB.service.MedsService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meds")
public class MedController {

    @Autowired
    private MedsService medsService;

    // Get all meds for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Med>> getMedsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(medsService.getMedsByUserId(userId));
    }

    // Get a single med by its ID
    @GetMapping("/{medId}")
    public ResponseEntity<Med> getMedById(@PathVariable Long medId) {
        return ResponseEntity.ok(medsService.getMedById(medId));
    }

    // Add a new med for a user
    @PostMapping("/user/{userId}")
    public ResponseEntity<Med> addMed(
            @PathVariable Long userId,
            @Valid @RequestBody Med dto
    ) {
        Med med = medsService.createMed(userId, dto.getName(), dto.getDailyIntake());
        return ResponseEntity.ok(med);
    }

    // Update an existing med
    @PutMapping("/{medId}")
    public ResponseEntity<Med> updateMed(
            @PathVariable Long medId,
            @Valid @RequestBody Med dto
    ) {
        Med updated = medsService.updateMed(medId, dto.getName(), dto.getDailyIntake());
        return ResponseEntity.ok(updated);
    }

    // Delete a med
    @DeleteMapping("/{medId}")
    public ResponseEntity<Void> deleteMed(@PathVariable Long medId) {
        medsService.deleteMed(medId);
        return ResponseEntity.noContent().build();
    }

}
