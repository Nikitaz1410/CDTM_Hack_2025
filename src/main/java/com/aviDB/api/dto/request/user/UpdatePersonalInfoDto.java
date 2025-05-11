package com.aviDB.api.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePersonalInfoDto {
    @NotBlank(message = "First name is required")
    private String first;

    @NotBlank(message = "Last name is required")
    private String last;

    private String weight;

    private String height;
}