package com.foodgo.request;

import lombok.Data;

import java.util.List;

@Data
public class CompleteRideRequest {
    private List<String> images;
    private String comment;
}
