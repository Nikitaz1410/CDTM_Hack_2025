// src/main/java/com/pokerapp/config/DataInitializer.java
package com.pokerapp.config;

import com.pokerapp.domain.user.User;
import com.pokerapp.repository.UserRepository;
import com.pokerapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) {
        // Create list of users to add
        List<User> users = new ArrayList<>();

        // Add admin user if it doesn't exist
        if (userRepository.findByUsername("Hoerter").isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("Hoerter");
            adminUser.setEmail("Hoerter@spade.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole("ROLE_ADMIN");
            adminUser.setBalance(50000); // Give admin a higher starting balance

            users.add(adminUser);
            System.out.println("Admin user created with username: Hoerter and password: admin123");
        }

        // Add regular players
        String[] playerNames = {"Sebastian", "Markus", "Matthi", "Luca", "Paul", "Viktor"};
        String defaultPassword = "password123";

        for (String name : playerNames) {
            if (userRepository.findByUsername(name).isEmpty()) {
                User player = new User();
                player.setUsername(name);
                player.setEmail(name.toLowerCase() + "@spade.com");
                player.setPassword(passwordEncoder.encode(defaultPassword));
                player.setRole("ROLE_USER");
                player.setBalance(2000); // Starting balance for regular players

                users.add(player);
                System.out.println("Player created with username: " + name + " and password: " + defaultPassword);
            }
        }

        // Save all users
        users = userRepository.saveAll(users);
    }
}