package com.aviDB.api.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BloodDto {

    @NotNull
    private LocalDate date;

    @NotBlank
    private String metric;

    @NotNull
    private Double value;
}
