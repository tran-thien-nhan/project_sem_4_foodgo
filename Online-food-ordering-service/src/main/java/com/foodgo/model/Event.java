package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String location;

    private String description;

    @JsonFormat(pattern = "dd/MM/yyyy hh:mm a")
    private LocalDateTime startedAt;

    @JsonFormat(pattern = "dd/MM/yyyy hh:mm a")
    private LocalDateTime endsAt;

    @ElementCollection
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
