package com.foodgo.service;

import com.foodgo.model.*;
import com.foodgo.repository.DriverRepository;
import com.foodgo.repository.LicenseRepository;
import com.foodgo.repository.RideRepository;
import com.foodgo.repository.VehicleRepository;
import com.foodgo.request.CreateLicenseVehicleRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DriverServiceImp implements DriverService{

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private Calculator distanceCalculator;

    @Override
    public Driver registerDriver(CreateLicenseVehicleRequest req) throws Exception {
        try{
            User driver = userService.findUserByJwtToken(req.getJwt());
            if(driver == null) {
                throw new Exception("User not found");
            }

            if (!driver.getRole().equals(USER_ROLE.ROLE_SHIPPER)) {
                throw new Exception("User is not a driver");
            }

            Driver newDriver = new Driver();
            License license = new License();
            Vehicle vehicle = new Vehicle();

            newDriver.setName(driver.getFullName());
            newDriver.setEmail(driver.getEmail());
            newDriver.setPhone(driver.getPhone());
            newDriver.setPassword(driver.getPassword());
            newDriver.setImageOfDriver(req.getImageOfDriver());
            newDriver.setRating(0.0);
            newDriver.setLatitude(0.0);
            newDriver.setLongitude(0.0);

            license.setLicenseNumber(req.getLicenseNumber());
            license.setLicenseExpirationDate(req.getLicenseExpirationDate());
            license.setLicenseState(req.getLicenseState());
            license.setImageOfLicense(req.getImageOfLicense());
            license.setDriver(newDriver);

            vehicle.setMake(req.getVehicleMake());
            vehicle.setModel(req.getVehicleModel());
            vehicle.setYear(req.getVehicleYear());
            vehicle.setColor(req.getVehicleColor());
            vehicle.setLicensePlate(req.getVehicleLicensePlate());
            vehicle.setCapacity(req.getVehicleCapacity());
            vehicle.setImageOfVehicle(req.getImageOfVehicle());
            vehicle.setDriver(newDriver);

            driver.setShipperInfoFilled(true);

            driverRepository.save(newDriver);
            licenseRepository.save(license);
            vehicleRepository.save(vehicle);

            return newDriver;
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<Driver> getAvailableDrivers(double restaurantLatitude, double restaurantLongitude, Ride ride) throws Exception {
        try{
            List<Driver> allDrivers = driverRepository.findAll();
            List<Driver> availableDrivers = new ArrayList<>();
            for (Driver driver : allDrivers) {
                // Nếu tài xế đang ở trong chuyến đi thì không thêm vào danh sách
                if(driver.getCurrentRide() != null && driver.getCurrentRide().getStatus().equals(RIDE_STATUS.COMPLETED)){
                    continue; // Nếu tài xế đã hoàn thành chuyến đi thì không thêm vào danh sách
                }

                // Nếu tài xế đã từ chối chuyến đi thì không thêm vào danh sách
                if(ride.getDeclinedDrivers().contains(driver.getId())){
                    System.out.println("Driver " + driver.getId() + " has declined the ride");
                    continue;
                }

                double driverLatitude = driver.getLatitude();
                double driverLongitude = driver.getLongitude();
                double distance = distanceCalculator.calculateDistance(restaurantLatitude, restaurantLongitude, driverLatitude, driverLongitude);
            }
            return availableDrivers;
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Driver findNearestDriver(List<Driver> availableDrivers, double restaurantLatitude, double restaurantLongitude) throws Exception {
        try{
            Driver nearestDriver = null;
            double minDistance = Double.MAX_VALUE;
            for (Driver driver : availableDrivers) {
                double driverLatitude = driver.getLatitude();
                double driverLongitude = driver.getLongitude();
                double distance = distanceCalculator.calculateDistance(restaurantLatitude, restaurantLongitude, driverLatitude, driverLongitude);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestDriver = driver;
                }
            }
            return nearestDriver;
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Driver getDriverProfile(String jwt) throws Exception {
        try{
            User user = userService.findUserByJwtToken(jwt);

            if(user == null) {
                throw new Exception("User not found");
            }

            if (!user.getRole().equals(USER_ROLE.ROLE_SHIPPER)) {
                throw new Exception("User is not a driver");
            }

            return driverRepository.findByEmailAndRole(user.getEmail(), USER_ROLE.ROLE_SHIPPER);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Ride getDriverCurrentRide(Long driverId) throws Exception {
        try{
            Driver driver = driverRepository.findById(driverId).get();
            return driver.getCurrentRide();
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<Ride> getAllocatedRides(Long driverId) throws Exception {
        try{
            return driverRepository.getAllocatedRides(driverId);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Driver findDriverById(Long driverId) throws Exception {
        try{
            Optional<Driver> driver = driverRepository.findById(driverId);
            if(driver.isPresent()){
                return driver.get();
            }
            else{
                throw new Exception("Driver not found");
            }
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<Ride> completedRides(Long driverId) throws Exception {
        try{
            return driverRepository.completedRides(driverId);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    private List<Ride> findByDriverAndStatus(Driver driver, RIDE_STATUS status) {
        List<Ride> rides = driver.getRides();
        List<Ride> completedRides = new ArrayList<>();
        for (Ride ride : rides) {
            if (ride.getStatus().equals(status)) {
                completedRides.add(ride);
            }
        }
        return completedRides;
    }
}
