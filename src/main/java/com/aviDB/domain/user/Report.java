package com.aviDB.domain.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Table(name = "report")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore  // Prevent serialization issues
    private User user;

    @Column(nullable = false)
    private String date;  // Date of the report

    @Column(columnDefinition = "LONGTEXT")
    private String text;  // Full text of the report

    @Column(columnDefinition = "LONGTEXT")
    private String summary;  // Summary of the report
}