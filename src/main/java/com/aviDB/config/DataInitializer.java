// src/main/java/com/pokerapp/config/DataInitializer.java
package com.aviDB.config;

import com.aviDB.domain.user.User;
import com.aviDB.repository.UserRepository;
import com.aviDB.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
        if (userRepository.findByEmail("Sebi@avi-health.de").isEmpty()) {
            User adminUser = new User();
            adminUser.setFirst("Sebi");
            adminUser.setLast("Tester");
            adminUser.setEmail("Sebi@avi-health.de");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole("ROLE_ADMIN");
            adminUser.setUsername(adminUser.getEmail());

            users.add(adminUser);
            System.out.println("Admin user created with username: Sebi@avi-health.de and password: admin123");
        }

        // Add regular players
        String[] playerEmails = {"Daniel@avi-health.de", "Luca@avi-health.de", "Nikita@avi-health.de"};
        String defaultPassword = "password123";

        for (String email : playerEmails) {
            String normalizedEmail = email.toLowerCase();

            if (userRepository.findByEmail(normalizedEmail).isEmpty()) {
                User player = new User();

                // Extract first name from email
                String firstName = normalizedEmail.split("@")[0];
                firstName = firstName.substring(0, 1).toUpperCase() + firstName.substring(1); // Capitalize

                player.setFirst(firstName);
                player.setLast("Tester");
                player.setEmail(normalizedEmail);
                player.setPassword(passwordEncoder.encode(defaultPassword));
                player.setRole("ROLE_USER");
                player.setUsername(player.getEmail());

                users.add(player);
                System.out.println("Player created with email: " + normalizedEmail + " and password: " + defaultPassword);
            }
        }

        // Save all users
        users = userRepository.saveAll(users);
    }
}
