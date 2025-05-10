package com.aviDB.api.controller;

import com.aviDB.api.dto.request.user.BloodDto;
import com.aviDB.domain.user.Blood;
import com.aviDB.service.BloodService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/blood-tests")
public class BloodController {

    @Autowired
    private BloodService bloodTestService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Blood>> getTestsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bloodTestService.getAllTestsForUser(userId));
    }

    @GetMapping("/{testId}")
    public ResponseEntity<Blood> getTestById(@PathVariable Long testId) {
        return ResponseEntity.ok(bloodTestService.getTestById(testId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Blood> addTest(
            @PathVariable Long userId,
            @Valid @RequestBody Blood dto
    ) {
        Blood test = bloodTestService.addTest(userId, dto.getDate(), dto.getMetric(), dto.getValue());
        return ResponseEntity.ok(test);
    }

    @PutMapping("/{testId}")
    public ResponseEntity<Blood> updateTest(
            @PathVariable Long testId,
            @Valid @RequestBody Blood dto
    ) {
        Blood updated = bloodTestService.updateTest(testId, dto.getDate(), dto.getMetric(), dto.getValue());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{testId}")
    public ResponseEntity<Void> deleteTest(@PathVariable Long testId) {
        bloodTestService.deleteTest(testId);
        return ResponseEntity.noContent().build();
    }

}
