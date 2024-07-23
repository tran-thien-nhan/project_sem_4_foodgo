package com.foodgo.controller;

import com.foodgo.dto.RideDto;
import com.foodgo.model.Driver;
import com.foodgo.model.Ride;
import com.foodgo.model.USER_ROLE;
import com.foodgo.model.User;
import com.foodgo.request.CreateLicenseVehicleRequest;
import com.foodgo.request.UpdateDriverInfoRequest;
import com.foodgo.service.DriverService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/register")
    public ResponseEntity<Driver> registerDriver(@RequestBody CreateLicenseVehicleRequest req,
                                 @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            Driver driver = driverService.registerDriver(req, user);
            return new ResponseEntity<>(driver, HttpStatus.CREATED);
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
    public ResponseEntity<RideDto> getDriverCurrentRide(@PathVariable Long driverId,
                                                     @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            RideDto ride = driverService.getDriverCurrentRide(driverId);
            return ResponseEntity.ok(ride);
        }
        catch(Exception e){
            throw new Exception("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{driverId}/allocated-rides")
    public ResponseEntity<List<RideDto>> getAllocatedRides(@PathVariable Long driverId,
                                                        @RequestHeader("Authorization") String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);
            List<RideDto> rides = driverService.getAllocatedRides(driverId);
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

    @PutMapping("/update/{driverId}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Long driverId,
                                               @RequestBody UpdateDriverInfoRequest req,
                                               @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            if (user == null || !user.getRole().equals(USER_ROLE.ROLE_SHIPPER)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            Driver driver = driverService.updateDriver(driverId, req);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{driverId}/image")
    public ResponseEntity<Void> deleteImage(@PathVariable Long driverId,
                                            @RequestParam String imageUrl,
                                            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            if (user == null || !user.getRole().equals(USER_ROLE.ROLE_SHIPPER)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            driverService.deleteImage(driverId, imageUrl);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
