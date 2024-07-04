package com.foodgo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "mails")
@AllArgsConstructor
@NoArgsConstructor
public class Mail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String toMails;
    private String subject;
    private String content;
    private LocalDateTime timestamp;

    @Transient // nghĩa là không lưu vào database
    private List<String> toAddresses;
}
