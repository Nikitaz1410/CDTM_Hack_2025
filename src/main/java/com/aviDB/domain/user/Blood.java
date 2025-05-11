package com.aviDB.domain.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Table(name = "blood")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})  // This prevents the serialization error
public class Blood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // Uncommented the JoinColumn
    @JsonIgnore  // This prevents circular reference and serialization issues
    private User user;

    @Column(name = "test_date", nullable = false)  // Uncommented the column annotation
    private String date;

    @Column(nullable = false)  // Uncommented the column annotation
    private String metric;

    @Column(nullable = false)  // Uncommented the column annotation
    private Double value;
}