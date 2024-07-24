package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    private int totalFavorites = 0;

    private int eventLimit = 0;

    private boolean isFull = false;

    private boolean isAvailable = true;

    private boolean emailSentNewEvent;
    private boolean emailSentEventStarted;
    private boolean emailSentEventFull;
    private boolean emailSentEventExpired;
    private boolean emailSentEventCanceled;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
//    @JsonIgnore
    private Restaurant restaurant;

    @JsonIgnore
    @ManyToMany
    @JoinTable(name = "event_user",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> users; // Mảng chứa thông tin các user tham gia event
}
