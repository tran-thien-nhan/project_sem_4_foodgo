package com.foodgo.service;

import com.foodgo.model.*;
import com.foodgo.repository.*;
import com.foodgo.request.RideRequest;
import com.foodgo.request.UpdateDriverInfoRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class RideServiceImp implements RideService{

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DriverService driverService;

    @Autowired
    private Calculator calculator;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    @Lazy //@Lazy là một annotation được sử dụng để chỉ định rằng một bean sẽ được tạo ra một cách lười biếng, nghĩa là nó sẽ không được tạo ra ngay khi ứng dụng khởi chạy mà chỉ khi nó được yêu cầu.
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Ride requestRide(RideRequest rideRequest) {
        try{
            double restaurantLatitude = rideRequest.getRestaurantLatitude();
            double restaurantLongitude = rideRequest.getRestaurantLongitude();

            double destinationLatitude = rideRequest.getDestinationLatitude();
            double destinationLongitude = rideRequest.getDestinationLongitude();

            Ride existingRide = new Ride();

            List<Driver> availableDrivers = driverService.getAvailableDrivers(
                    restaurantLatitude,
                    restaurantLongitude,
                    existingRide);

            if(availableDrivers.size() == 0) {
                throw new RuntimeException("No driver available");
            }

            Driver nearestDriver = driverService.findNearestDriver(
                    availableDrivers,
                    restaurantLatitude,
                    restaurantLongitude);

            if(nearestDriver == null) {
                throw new RuntimeException("No driver near restaurant");
            }

            Ride ride = createRideRequest(
                    nearestDriver,
                    restaurantLatitude,
                    restaurantLongitude,
                    destinationLatitude,
                    destinationLongitude,
                    rideRequest);

            return ride;
        }
        catch(Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Ride createRideRequest(Driver nearestDriver, double restaurantLatitude, double restaurantLongitude, double destinationLatitude, double destinationLongitude, RideRequest rideRequest) {
        try {
            System.out.println("rideRequest: " + rideRequest);
            if (rideRequest.getUserId() == null) {
                throw new RuntimeException("User ID must not be null");
            } else if (rideRequest.getRestaurantId() == null) {
                throw new RuntimeException("Restaurant ID must not be null");
            } else if (rideRequest.getOrderId() == null) {
                throw new RuntimeException("Order ID must not be null");
            }

            User user = userService.findUserById(rideRequest.getUserId());
            Restaurant restaurant = restaurantService.findRestaurantById(rideRequest.getRestaurantId());
            Order order = orderService.findOrderById(rideRequest.getOrderId());

            String userAddress = order.getDeliveryAddress().getStreetAddress();

            String restaurantAddress = restaurant.getAddress().getStreetAddress();
            Ride ride = new Ride();

            ride.setDriver(nearestDriver);
            ride.setRestaurantLatitude(restaurantLatitude);
            ride.setRestaurantLongitude(restaurantLongitude);
            ride.setDestinationLatitude(destinationLatitude);
            ride.setDestinationLongitude(destinationLongitude);

            ride.setUser(user);
            ride.setRestaurant(restaurant);
            ride.setOrders(List.of(order));

            ride.setUserAddress(userAddress);
            ride.setRestaurantAddress(restaurantAddress);

            ride.setDestinationAddress(userAddress);
            ride.setDriverStopLatitude(nearestDriver.getLatitude());
            ride.setDriverStopLongitude(nearestDriver.getLongitude());

            // Cập nhật thông tin tài xế
            nearestDriver.setCurrentRide(ride);
            driverService.updateDriver(nearestDriver.getId(), new UpdateDriverInfoRequest());

            rideRepository.save(ride);

            return ride;
        }
        catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Ride findRideById(Long id) throws Exception {
        try {
            Optional<Ride> ride = rideRepository.findById(id);
            if(ride.isPresent()) {
                return ride.get();
            }
            else {
                throw new Exception("Ride not found");
            }
        }
        catch (Exception e) {
            throw new RuntimeException("Error in finding ride by id");
        }
    }

    @Override
    public void acceptRide(Long rideId) {
        try {
            Ride ride = findRideById(rideId);
            ride.setStatus(RIDE_STATUS.ACCEPTED);
            Driver driver = ride.getDriver();
            driver.setCurrentRide(ride);
            driverRepository.save(driver);
            rideRepository.save(ride);
        }
        catch (Exception e) {
            throw new RuntimeException("Error in accepting ride");
        }
    }

    @Override
    public void declineRide(Long rideId, Long driverId) {
        try {
            Ride ride = findRideById(rideId);
            DeclinedDriver declinedDriver = new DeclinedDriver();
            declinedDriver.setId(driverId);
            ride.getDeclinedDrivers().add(declinedDriver);
            List<Driver> availableDrivers = driverService.getAvailableDrivers(
                    ride.getRestaurantLatitude(),
                    ride.getRestaurantLongitude(),
                    ride);
            Driver nearestDriver = driverService.findNearestDriver(
                    availableDrivers,
                    ride.getRestaurantLatitude(),
                    ride.getRestaurantLongitude()
            );
            ride.setDriver(nearestDriver);
            rideRepository.save(ride);
        }
        catch (Exception e) {
            throw new RuntimeException("Error in declining ride");
        }
    }

    @Override
    public void startRide(Long rideId) {
        try {
            Ride ride = findRideById(rideId);
            ride.setStatus(RIDE_STATUS.STARTED);
            ride.setStartTime(LocalDateTime.now());
            rideRepository.save(ride);
        }
        catch (Exception e) {
            throw new RuntimeException("Error in starting ride");
        }
    }

    @Override
    public void completeRide(Long rideId) {
        try {
            Ride ride = findRideById(rideId);
            Driver driver = ride.getDriver();
            driver.setCurrentRide(null);
            ride.setStatus(RIDE_STATUS.COMPLETED);
            ride.setEndTime(LocalDateTime.now());

            LocalDateTime startTime = ride.getStartTime();
            LocalDateTime endTime = ride.getEndTime();

            if (startTime == null || endTime == null) {
                throw new RuntimeException("Ride start time or end time is null");
            }

            Duration duration = Duration.between(startTime, endTime);
            Long durationInMinutes = duration.toMinutes();
            ride.setDuration(durationInMinutes);

            double distance = calculator.calculateDistance(
                    ride.getRestaurantLatitude(),
                    ride.getRestaurantLongitude(),
                    ride.getDestinationLatitude(),
                    ride.getDestinationLongitude());

            ride.setDistance(Math.round(distance * 100.0/100.0));

            double fare = calculator.calculateFare(distance);
            ride.setFare(Math.round(fare));

            driver.getRides().add(ride);
            Long totalRevenue = ride.getDriver().getTotalRevenue() + Math.round(fare * 0.8);
            driver.setTotalRevenue(totalRevenue);

            driverRepository.save(driver);
            rideRepository.save(ride);
        }
        catch (Exception e) {
            throw new RuntimeException("Error in completing ride");
        }
    }

    @Override
    public void cancelRide(Long rideId) {
        try {
            Ride ride = findRideById(rideId);
            ride.setStatus(RIDE_STATUS.CANCELLED);
            rideRepository.save(ride);
        }
        catch (Exception e) {
            throw new RuntimeException("Error in cancelling ride");
        }
    }
}
