package com.aviDB.service;

import com.aviDB.domain.user.Blood;
import com.aviDB.domain.user.Vaccination;
import com.aviDB.domain.user.User;
import com.aviDB.exception.NotFoundException;
import com.aviDB.repository.UserRepository;
import com.aviDB.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VaccinationService {

    private final VaccinationRepository vaccinationRepository;

    @Autowired
    private UserRepository userRepository;

    // Constructor injection for VaccinationRepository
    @Autowired
    public VaccinationService(VaccinationRepository vaccinationRepository) {
        this.vaccinationRepository = vaccinationRepository;
    }

    // Find all vaccinations for a given user
    public List<Vaccination> getVaccinationsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return vaccinationRepository.findByUserId(userId);
    }

    // Optional: Add a vaccination record to the database
    public Vaccination addVaccination(Vaccination vaccination) {
        return vaccinationRepository.save(vaccination);
    }

    // Optional: Update an existing vaccination record
    public Vaccination updateVaccination(Vaccination vaccination) {
        return vaccinationRepository.save(vaccination);
    }

    // Optional: Delete a vaccination record
    public void deleteVaccination(Long vaccinationId) {
        vaccinationRepository.deleteById(vaccinationId);
    }
}
