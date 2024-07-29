package com.foodgo.service;

import com.foodgo.dto.RideDto;
import com.foodgo.mapper.DtoMapper;
import com.foodgo.model.*;
import com.foodgo.repository.*;
import com.foodgo.request.CreateLicenseVehicleRequest;
import com.foodgo.request.UpdateDriverInfoRequest;
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

    @Autowired
    private UserRepository userRepository;

    @Override
    public Driver registerDriver(CreateLicenseVehicleRequest req, User user) throws Exception {
        try{

            if (!user.getRole().equals(USER_ROLE.ROLE_SHIPPER)) {
                throw new Exception("User is not a driver");
            }

            Driver newDriver = new Driver();
            License license = new License();
            Vehicle vehicle = new Vehicle();
            Address address = new Address();

            newDriver.setName(user.getFullName());
            newDriver.setEmail(user.getEmail());
            newDriver.setPhone(user.getPhone());
            newDriver.setPassword(user.getPassword());
            newDriver.setImageOfDriver(req.getImageOfDriver());
            newDriver.setRating(0.0);
            newDriver.setLatitude(0.0);
            newDriver.setLongitude(0.0);
            newDriver.setDriver(user);

            address.setCity(req.getCity());
            address.setCountry(req.getCountry());
            address.setStreetAddress(req.getStreetAddress());
            address.setPinCode(req.getPinCode());
            address.setPhone(user.getPhone());
            address.setUser(user);

            license.setLicenseNumber(req.getLicenseNumber());
            license.setLicenseExpirationDate(req.getLicenseExpirationDate());
            license.setLicenseState(req.getLicenseState());
            license.setImageOfLicense(req.getImageOfLicense());
            license.setDriver(newDriver);

            vehicle.setMake(req.getMake());
            vehicle.setModel(req.getModel());
            vehicle.setYear(req.getYear());
            vehicle.setColor(req.getColor());
            vehicle.setLicensePlate(req.getVehicleLicensePlate());
            vehicle.setCapacity(req.getCapacity());
            vehicle.setImageOfVehicle(req.getImageOfVehicle());
            vehicle.setDriver(newDriver);

            newDriver.setLicense(license);
            newDriver.setVehicle(vehicle);

            user.setShipperInfoFilled(true);

            driverRepository.save(newDriver);
//            licenseRepository.save(license);
//            vehicleRepository.save(vehicle);

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
            System.out.println("All drivers: " + allDrivers);
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

                availableDrivers.add(driver);
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
                if(driverRepository.getAllocatedRides(driver.getId()).size() == 1){
                    continue;
                }
                if (distance < minDistance){
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
    public RideDto getDriverCurrentRide(Long driverId) throws Exception {
        try{
            Optional<Driver> driverOpt = driverRepository.findById(driverId);
            if (!driverOpt.isPresent()) {
                throw new Exception("Driver not found");
            }

            Driver driver = driverOpt.get();
            Ride ride = driver.getCurrentRide();
            if (ride == null) {
                return null;
            }

            return DtoMapper.toRideDto(ride);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<RideDto> getAllocatedRides(Long driverId) throws Exception {
        try{
            List<Ride> rides = driverRepository.getAllocatedRides(driverId);
            List<RideDto> rideDtos = new ArrayList<>();
            for (Ride ride : rides) {
                RideDto r = DtoMapper.toRideDto(ride);
                rideDtos.add(r);
            }
            return rideDtos;
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
    public List<RideDto> completedRides(Long driverId) throws Exception {
        try{
//            return driverRepository.completedRides(driverId);
            List<Ride> rides = driverRepository.completedRides(driverId);
            List<RideDto> rideDtos = new ArrayList<>();
            for (Ride ride : rides) {
                RideDto r = DtoMapper.toRideDto(ride);
                rideDtos.add(r);
            }
            return rideDtos;
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public Driver updateDriver(Long driverId, UpdateDriverInfoRequest req) throws Exception {
        try {
            Optional<Driver> driverOpt = driverRepository.findById(driverId);
            if (!driverOpt.isPresent()) {
                throw new Exception("Driver not found");
            }

            Driver driver = driverOpt.get();
            User user = driver.getDriver();

            // Cập nhật thông tin tài xế
            driver.setName(req.getName());
            driver.setPhone(req.getPhone());
            driver.setImageOfDriver(req.getImageOfDriver());
            driver.setEmail(req.getEmail());
            driver.setPhone(req.getPhone());

            // Cập nhật thông tin người dùng
            user.setEmail(req.getEmail());
            driver.setEmail(req.getEmail());

            // Cập nhật địa chỉ
            Address address = driver.getAddress();
            if (address == null) {
                address = new Address();
                address.setUser(user);
            }
            address.setStreetAddress(req.getStreetAddress());
            address.setCity(req.getCity());
            address.setState(req.getState());
            address.setPinCode(req.getPinCode());
            address.setCountry(req.getCountry());
            driver.setAddress(address);

            // Cập nhật thông tin bằng lái
            License license = driver.getLicense();
            if (license == null) {
                license = new License();
                license.setDriver(driver);
            }
            license.setLicenseNumber(req.getLicenseNumber());
            license.setLicenseState(req.getLicenseState());
            license.setLicenseExpirationDate(req.getLicenseExpirationDate());
            license.setImageOfLicense(req.getImageOfLicense());
            driver.setLicense(license);

            // Cập nhật thông tin xe
            Vehicle vehicle = driver.getVehicle();
            if (vehicle == null) {
                vehicle = new Vehicle();
                vehicle.setDriver(driver);
            }
            vehicle.setMake(req.getMake());
            vehicle.setModel(req.getModel());
            vehicle.setYear(req.getYear());
            vehicle.setColor(req.getColor());
            vehicle.setLicensePlate(req.getVehicleLicensePlate());
            vehicle.setCapacity(req.getCapacity());
            vehicle.setImageOfVehicle(req.getImageOfVehicle());
            driver.setVehicle(vehicle);

            // Lưu thông tin tài xế vào cơ sở dữ liệu
            driverRepository.save(driver);

            return driver;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }


    @Override
    public void deleteImage(Long driverId, String imageUrl) throws Exception {
        try {
            Optional<Driver> driverOpt = driverRepository.findById(driverId);
            if (!driverOpt.isPresent()) {
                throw new Exception("Driver not found");
            }

            Driver driver = driverOpt.get();
            List<String> images = driver.getImageOfDriver();
            if (images.remove(imageUrl)) {
                driver.setImageOfDriver(images);
                driverRepository.save(driver);
            } else {
                throw new Exception("Image not found");
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<RideDto> cancelledRides(Long driverId) throws Exception {
        try{
            List<Ride> rides = driverRepository.cancelledRides(driverId);
            List<RideDto> rideDtos = new ArrayList<>();
            for (Ride ride : rides) {
                RideDto r = DtoMapper.toRideDto(ride);
                rideDtos.add(r);
            }
            return rideDtos;
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
