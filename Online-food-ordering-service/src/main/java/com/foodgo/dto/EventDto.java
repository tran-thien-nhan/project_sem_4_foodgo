package com.foodgo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data // Tự động tạo getter, setter, toString, equals, hashCode
@Embeddable // Đánh dấu là một phần của entity khác, không phải một entity riêng biệt, không có id
public class EventDto {
    private Long id;

    private String name;

    private String location;

    private String description;

    private String ofRestaurant;

    private Integer eventLimit = 0;

    private Boolean isFull = false;

    private Boolean isAvailable = true;

    @JsonFormat(pattern = "dd/MM/yyyy hh:mm a")
    private LocalDateTime startedAt;

    @JsonFormat(pattern = "dd/MM/yyyy hh:mm a")
    private LocalDateTime endsAt;

    private List<String> images;
}
