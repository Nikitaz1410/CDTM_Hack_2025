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
@Transactional  // Add this to handle lazy loading issues
public class MedsService {

    @Autowired
    private MedsRepository medsRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(rollbackOn = Exception.class)  // Ensure transaction is active for lazy loading
    public List<Med> getMedsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NotFoundException("User not found");
        }
        return medsRepository.findByUserId(userId);
    }

    @Transactional(rollbackOn = Exception.class)
    public Med getMedById(Long medId) {
        return medsRepository.findById(medId)
                .orElseThrow(() -> new NotFoundException("Medication not found"));
    }

    @Transactional(rollbackOn = Exception.class)
    public Med createMed(Long userId, String name, Integer dailyIntake) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Med med = new Med();
        med.setUser(user);
        med.setName(name);
        med.setDailyIntake(dailyIntake);

        return medsRepository.save(med);
    }

    @Transactional(rollbackOn = Exception.class)
    public Med updateMed(Long medId, String name, Integer dailyIntake) {
        Med med = getMedById(medId);

        med.setName(name);
        med.setDailyIntake(dailyIntake);

        return medsRepository.save(med);
    }

    @Transactional(rollbackOn = Exception.class)
    public void deleteMed(Long medId) {
        if (!medsRepository.existsById(medId)) {
            throw new NotFoundException("Medication not found");
        }
        medsRepository.deleteById(medId);
    }
}