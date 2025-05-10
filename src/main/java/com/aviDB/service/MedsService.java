package com.aviDB.service;

import com.aviDB.domain.user.Med;
import com.aviDB.domain.user.User;
import com.aviDB.exception.NotFoundException;
import com.aviDB.repository.MedsRepository;
import com.aviDB.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedsService {

    @Autowired
    private MedsRepository medsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Med> getMedsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found");
        }
        return medsRepository.findByUserId(userId);
    }

    public Med getMedById(Long medId) {
        return medsRepository.findById(medId)
                .orElseThrow(() -> new NotFoundException("Medication not found"));
    }

    @Transactional
    public Med createMed(Long userId, String name, String dailyIntake) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Med med = new Med();
        med.setUser(user);
        med.setName(name);
        med.setDailyIntake(dailyIntake);

        return medsRepository.save(med);
    }

    @Transactional
    public Med updateMed(Long medId, String name, String dailyIntake) {
        Med med = getMedById(medId);

        med.setName(name);
        med.setDailyIntake(dailyIntake);

        return medsRepository.save(med);
    }

    @Transactional
    public void deleteMed(Long medId) {
        if (!medsRepository.existsById(medId)) {
            throw new NotFoundException("Medication not found");
        }
        medsRepository.deleteById(medId);
    }
}
