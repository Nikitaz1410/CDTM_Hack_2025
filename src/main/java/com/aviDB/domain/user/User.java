package com.aviDB.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @Column(name = "first_name", nullable = false)
    private String first;

    @Column(name = "last_name", nullable = false)
    private String last;

    private String weight;

    private String height;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @Column(name = "role")
    private String role = "ROLE_USER"; // Default role

    // Method to check if user has admin role
    public boolean isAdmin() {
        return "ROLE_ADMIN".equals(this.role);
    }
}
