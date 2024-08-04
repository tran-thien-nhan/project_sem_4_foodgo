package com.foodgo.controller;

import com.foodgo.model.Location;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class LocationController {
    private final SimpMessagingTemplate messagingTemplate;

    public LocationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/location")
    @SendTo("/topic/location")
    public Location updateLocation(Location location) {
        return location;
    }

    public void sendLocationUpdate(Location location) {
        messagingTemplate.convertAndSend("/topic/location", location);
    }
}
