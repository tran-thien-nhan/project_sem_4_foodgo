package com.foodgo.dto;

import com.foodgo.model.Address;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.util.List;

@Data
@Embeddable
public class UserDto {
    private Long userId;
    private String email;
    private String fullName;
}
