package com.foodgo.controller;


import com.foodgo.model.Ride;
import com.foodgo.request.RideRequest;
import com.foodgo.service.DriverService;
import com.foodgo.service.RideService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/shipper/ride")
public class RideController {
    @Autowired
    private RideService rideService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private UserService userService;

    @PostMapping("/request")
    public Ride requestRide(@RequestBody RideRequest rideRequest) {
        try{
            return rideService.requestRide(rideRequest);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Ride findRideById(@PathVariable Long id) {
        try {
            return rideService.findRideById(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    @PutMapping("/accept/{id}")
    public void acceptRide(@PathVariable Long id) {
        try{
            rideService.acceptRide(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    @PutMapping("/decline/{rideId}/{driverId}")
    public void declineRide(@PathVariable Long rideId, @PathVariable Long driverId) {
        try{
            rideService.declineRide(rideId, driverId);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    @PutMapping("/start/{id}")
    public void startRide(@PathVariable Long id) {
        try{
            rideService.startRide(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    @PutMapping("/complete/{id}")
    public void completeRide(@PathVariable Long id) {
        try{
            rideService.completeRide(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }

    @PutMapping("/cancel/{id}")
    public void cancelRide(@PathVariable Long id) {
        try{
            rideService.cancelRide(id);
        } catch (Exception e) {
            throw new RuntimeException("Ride not found");
        }
    }
}
