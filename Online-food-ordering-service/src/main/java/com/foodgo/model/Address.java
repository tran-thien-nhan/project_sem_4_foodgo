package com.foodgo.model;

import jakarta.persistence.*;

@Entity //nghĩa là class này sẽ tương tác với database
public class Address {
    @Id //nghĩa là id là primary key
    @GeneratedValue(strategy = GenerationType.AUTO) //tự động tăng giá trị id
    private Long id;



}
