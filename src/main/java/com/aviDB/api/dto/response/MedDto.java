// Create MedDto.java
package com.aviDB.api.dto.response;

import com.aviDB.domain.user.Med;
import com.aviDB.service.MedsService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Getter
@Setter
public class MedDto {
    private Long id;
    private String name;
    private Integer dailyIntake;
    private Long userId;  // Just the user ID, not the full user object

    // Optional: if you need basic user info
    private String userEmail;
    private String userName;
}