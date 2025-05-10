package com.aviDB.domain.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    //@Column(nullable = false)
    private String date;  // Date of the report

    @Column(columnDefinition = "LONGTEXT")
    private String text;  // Full text of the report

    @Column(columnDefinition = "LONGTEXT")
    private String summary;  // Summary of the report
}
