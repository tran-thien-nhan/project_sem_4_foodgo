package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class License {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String licenseNumber; // số bằng lái

    private String licenseState; // nơi cấp bằng lái

    private String licenseExpirationDate; // ngày hết hạn bằng lái

    @ElementCollection // Đánh dấu là một collection của các phần tử, không phải một entity riêng biệt
    @Column(length = 1000) // Độ dài tối đa của mỗi phần tử
    private List<String> imageOfLicense; // ảnh của bằng lái

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    @ToString.Exclude
    private Driver driver;
}
