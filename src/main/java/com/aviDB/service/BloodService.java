package com.aviDB.service;

import com.aviDB.domain.user.Blood;
import com.aviDB.domain.user.User;
import com.aviDB.exception.NotFoundException;
import com.aviDB.repository.BloodRepository;
import com.aviDB.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodService {

    @Autowired
    private BloodRepository bloodTestRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Blood> getBloodsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return bloodTestRepository.findByUser(user);
    }

    public Blood getBloodById(Long testId) {
        return bloodTestRepository.findById(testId)
                .orElseThrow(() -> new NotFoundException("Blood test not found"));
    }

    @Transactional
    public Blood addBlood(Long userId, String date, String metric, Double value) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Blood bloodTest = new Blood();
        bloodTest.setUser(user);
        bloodTest.setDate(date);
        bloodTest.setMetric(metric);
        bloodTest.setValue(value);

        return bloodTestRepository.save(bloodTest);
    }

    @Transactional
    public Blood updateBlood(Long testId, String date, String metric, Double value) {
        Blood test = getBloodById(testId);

        test.setDate(date);
        test.setMetric(metric);
        test.setValue(value);

        return bloodTestRepository.save(test);
    }

    @Transactional
    public void deleteBlood(Long testId) {
        Blood test = getBloodById(testId);
        bloodTestRepository.delete(test);
    }
}
