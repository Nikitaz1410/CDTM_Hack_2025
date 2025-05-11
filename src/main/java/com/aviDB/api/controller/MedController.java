// Update MedController.java
package com.aviDB.api.controller;

import com.aviDB.domain.user.Med;
import com.aviDB.api.dto.response.MedDto;
import com.aviDB.service.MedsService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity<MedDto> getMedById(@PathVariable Long medId) {
        Med med = medsService.getMedById(medId);
        return ResponseEntity.ok(convertToDto(med));
    }

    // Add a new med for a user
    @PostMapping("/user/{userId}")
    public ResponseEntity<MedDto> addMed(
            @PathVariable Long userId,
            @Valid @RequestBody Med dto
    ) {
        Med med = medsService.createMed(userId, dto.getName(), dto.getDailyIntake());
        return ResponseEntity.ok(convertToDto(med));
    }

    // Update an existing med
    @PutMapping("/{medId}")
    public ResponseEntity<MedDto> updateMed(
            @PathVariable Long medId,
            @Valid @RequestBody Med dto
    ) {
        Med updated = medsService.updateMed(medId, dto.getName(), dto.getDailyIntake());
        return ResponseEntity.ok(convertToDto(updated));
    }

    // Delete a med
    @DeleteMapping("/{medId}")
    public ResponseEntity<Void> deleteMed(@PathVariable Long medId) {
        medsService.deleteMed(medId);
        return ResponseEntity.noContent().build();
    }

    private MedDto convertToDto(Med med) {
        MedDto dto = new MedDto();
        dto.setId(med.getId());
        dto.setName(med.getName());
        dto.setDailyIntake(med.getDailyIntake());
        dto.setUserId(med.getUser().getId());

        // Optional: add user info if needed
        dto.setUserEmail(med.getUser().getEmail());
        dto.setUserName(med.getUser().getUsername());

        return dto;
    }
}