package com.aviDB.domain.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Table(name = "vaccination")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore  // Prevent serialization issues
    private User user;

    @Column()
    private String name;  // Name of the vaccine

    @Column()
    private String date;  // Date of vaccination

    @Column()
    private String disease;  // Disease vaccinated against
}