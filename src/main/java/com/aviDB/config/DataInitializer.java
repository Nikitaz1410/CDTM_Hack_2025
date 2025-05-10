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
        if (userRepository.findByUsername("Sebi").isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("Sebi");
            adminUser.setEmail("Sebi@avi-health.de");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole("ROLE_ADMIN");

            users.add(adminUser);
            System.out.println("Admin user created with username: Hoerter and password: admin123");
        }

        // Add regular players
        String[] playerNames = {"Sebastian", "Luca", "Nikita"};
        String defaultPassword = "password123";

        for (String name : playerNames) {
            if (userRepository.findByUsername(name).isEmpty()) {
                User player = new User();
                player.setUsername(name);
                player.setEmail(name.toLowerCase() + "@avi-health.de");
                player.setPassword(passwordEncoder.encode(defaultPassword));
                player.setRole("ROLE_USER");

                users.add(player);
                System.out.println("Player created with username: " + name + " and password: " + defaultPassword);
            }
        }

        // Save all users
        users = userRepository.saveAll(users);
    }
}
