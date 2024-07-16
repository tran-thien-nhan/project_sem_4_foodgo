package com.foodgo.controller;

import com.foodgo.model.Driver;
import com.foodgo.model.Ride;
import com.foodgo.model.User;
import com.foodgo.request.CreateLicenseVehicleRequest;
import com.foodgo.service.DriverService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shipper")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @Autowired
    private UserService userService;

    @PostMapping()
    public Driver registerDriver(@RequestBody CreateLicenseVehicleRequest req,
                                 @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            return driverService.registerDriver(req);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers(@RequestParam double restaurantLatitude,
                                                            @RequestParam double restaurantLongitude,
                                                            @RequestParam Ride ride,
                                                            @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            List<Driver> drivers = driverService.getAvailableDrivers(restaurantLatitude, restaurantLongitude, ride);
            return ResponseEntity.ok(drivers);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

    @GetMapping("/nearest")
    public ResponseEntity<Driver> findNearestDriver(
            @RequestBody List<Driver> availableDrivers,
            @RequestParam double restaurantLatitude,
            @RequestParam double restaurantLongitude,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Driver driver = driverService.findNearestDriver(availableDrivers, restaurantLatitude, restaurantLongitude);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Driver> getDriverProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        try{
            Driver driver = driverService.getDriverProfile(jwt);
            return ResponseEntity.ok(driver);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{driverId}/current-ride")
    public ResponseEntity<Ride> getDriverCurrentRide(@PathVariable Long driverId,
                                                     @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            Ride ride = driverService.getDriverCurrentRide(driverId);
            return ResponseEntity.ok(ride);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{driverId}/allocated-rides")
    public ResponseEntity<List<Ride>> getAllocatedRides(@PathVariable Long driverId,
                                                        @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            List<Ride> rides = driverService.getAllocatedRides(driverId);
            return ResponseEntity.ok(rides);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<Driver> findDriverById(@PathVariable Long driverId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            Driver driver = driverService.findDriverById(driverId);
            return ResponseEntity.ok(driver);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{driverId}/completed-rides")
    public ResponseEntity<List<Ride>> completedRides(@PathVariable Long driverId,
                                                     @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            List<Ride> rides = driverService.completedRides(driverId);
            return ResponseEntity.ok(rides);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

}
