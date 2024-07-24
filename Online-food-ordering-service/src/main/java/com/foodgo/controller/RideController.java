package com.foodgo.controller;


import com.foodgo.model.Ride;
import com.foodgo.repository.RideRepository;
import com.foodgo.request.RideRequest;
import com.foodgo.service.DriverService;
import com.foodgo.service.RideService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shipper/ride")
public class RideController {
    @Autowired
    private RideService rideService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private UserService userService;

    @Autowired
    private RideRepository rideRepository;

    @PostMapping("/request")
    public Ride requestRide(@RequestBody RideRequest rideRequest,
                            @RequestHeader("Authorization") String jwt) {
        try{
            userService.findUserByJwtToken(jwt);
            return rideService.requestRide(rideRequest);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Ride findRideById(@PathVariable Long id,
                             @RequestHeader("Authorization") String jwt) {
        try {
            userService.findUserByJwtToken(jwt);
            return rideService.findRideById(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    @PutMapping("/accept/{id}")
    public void acceptRide(@PathVariable Long id,
                           @RequestHeader("Authorization") String jwt) {
        try{
            userService.findUserByJwtToken(jwt);
            rideService.acceptRide(id);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PutMapping("/decline/{rideId}/{driverId}")
    public void declineRide(@PathVariable Long rideId, @PathVariable Long driverId,
                            @RequestHeader("Authorization") String jwt) {
        try{
            userService.findUserByJwtToken(jwt);
            rideService.declineRide(rideId, driverId);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PutMapping("/start/{id}")
    public void startRide(@PathVariable Long id,
                          @RequestHeader("Authorization") String jwt) {
        try{
            userService.findUserByJwtToken(jwt);
            rideService.startRide(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    @PutMapping("/complete/{id}")
    public void completeRide(@PathVariable Long id,
                             @RequestHeader("Authorization") String jwt) {
        try{
            userService.findUserByJwtToken(jwt);
            rideService.completeRide(id);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PutMapping("/cancel/{id}")
    public void cancelRide(@PathVariable Long id,
                           @RequestHeader("Authorization") String jwt) {
        try{
            userService.findUserByJwtToken(jwt);
            rideService.cancelRide(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    //findall
    @GetMapping("/all")
    public List<Ride> findAllRide(@RequestHeader("Authorization") String jwt) {
        try {
            userService.findUserByJwtToken(jwt);
            return rideRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }
}
