package com.foodgo.service;

import com.foodgo.dto.DriverDto;
import com.foodgo.mapper.DtoMapper;
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

    @Autowired
    private DeclinedDriverRepository declinedDriverRepository;
    @Override
    public Ride requestRide(RideRequest rideRequest) {
        try{
            Order isOrderHasRide = orderService.findOrderById(rideRequest.getOrderId());
            if(isOrderHasRide.getRide() != null) {
                throw new RuntimeException("Order has been taken");
            }
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
                throw new RuntimeException("No driver near restaurant"); // mai mot cho vào hàng chờ redis
            }

            DriverDto driverDto = DtoMapper.toDriverDto(nearestDriver);
            isOrderHasRide.setDriverdto(driverDto);
            orderRepository.save(isOrderHasRide);

            Ride ride = createRideRequest(
                    nearestDriver,
                    restaurantLatitude,
                    restaurantLongitude,
                    destinationLatitude,
                    destinationLongitude,
                    rideRequest);

            rideRepository.save(ride);
            return ride;
        }
        catch(Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Ride createRideRequest(Driver nearestDriver, double restaurantLatitude, double restaurantLongitude, double destinationLatitude, double destinationLongitude, RideRequest rideRequest) {
        try {
//            System.out.println("rideRequest: " + rideRequest);
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

            userRepository.save(user);
            restaurantRepository.save(restaurant);
            orderRepository.save(order);

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
            ride.setOrder(order);

            ride.setUserAddress(userAddress);
            ride.setRestaurantAddress(restaurantAddress);

            ride.setDestinationAddress(userAddress);
            ride.setDriverStopLatitude(nearestDriver.getLatitude());
            ride.setDriverStopLongitude(nearestDriver.getLongitude());

            ride.setStartTime(LocalDateTime.now());
            ride.setTotal(order.getTotalPrice());
            ride.setFare(order.getFare());
            ride.setDuration(order.getDuration());
            ride.setDistance(order.getDistance());
            ride.setRestaurantAddress(restaurant.getAddress().getStreetAddress());

            rideRepository.save(ride);

            order.setRide(ride);
            orderRepository.save(order);

            // Cập nhật thông tin tài xế
//            nearestDriver.setCurrentRide(ride);
//            driverRepository.save(nearestDriver);

            return ride;
        }
        catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Ride findRideById(Long id) throws Exception {
        try {
            List<Ride> rides = rideRepository.findAll();
            for (Ride ride : rides) {
                if (ride.getId().equals(id)) {
                    return ride;
                }
            }
            return null;
        }
        catch (Exception e) {
            throw new RuntimeException("Error in finding ride by id");
        }
    }

    @Override
    public void acceptRide(Long rideId) { // Chấp nhận chuyến đi
        try {
            Ride ride = findRideById(rideId); // Tìm chuyến đi theo ID
            ride.setStatus(RIDE_STATUS.ACCEPTED); // Cập nhật trạng thái chuyến đi thành đã chấp nhận
            Driver driver = ride.getDriver(); // Lấy thông tin tài xế
            if(driver.getCurrentRide() != null) { // Nếu tài xế đã có chuyến đi khác
                throw new RuntimeException("Driver already has a ride");
            }
            driver.setCurrentRide(ride); // Cập nhật chuyến đi hiện tại của tài xế thành chuyến đi vừa chấp nhận
            driverRepository.save(driver); // Lưu thông tin tài xế
            rideRepository.save(ride); // Lưu thông tin chuyến đi
        }
        catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void declineRide(Long rideId, Long driverId) {
        try {
            Ride ride = findRideById(rideId); // Tìm chuyến đi theo ID
            if (ride == null) {
                throw new RuntimeException("Ride not found");
            }

            Driver driver = driverRepository.findById(driverId).orElse(null); // Tìm tài xế theo ID
            if (driver == null) {
                throw new RuntimeException("Driver not found");
            }

            DeclinedDriver declinedDriver = new DeclinedDriver(); // Tạo một tài xế từ chối
            declinedDriver.setRide(ride); // Gán chuyến đi cho tài xế từ chối
            declinedDriver.setDriver(driver); // Gán thông tin tài xế từ chối

            Order order = ride.getOrder(); // Lấy thông tin đơn hàng
            if (order != null) {
                order.setDriverdto(null); // Xóa thông tin tài xế
            }

            declinedDriverRepository.save(declinedDriver); // Lưu thông tin tài xế từ chối
            ride.getDeclinedDrivers().add(declinedDriver); // Thêm tài xế từ chối vào danh sách tài xế từ chối

            // Lấy danh sách tài xế có sẵn
            List<Driver> availableDrivers = driverService.getAvailableDrivers(
                    ride.getRestaurantLatitude(),
                    ride.getRestaurantLongitude(),
                    ride
            );

            // Loại bỏ tài xế đã từ chối
            availableDrivers.removeIf(d -> ride.getDeclinedDrivers().stream()
                    .anyMatch(declined -> declined.getDriver().getId().equals(d.getId()))
            );

            // Tìm tài xế gần nhà hàng nhất
            Driver nearestDriver = driverService.findNearestDriver(
                    availableDrivers,
                    ride.getRestaurantLatitude(),
                    ride.getRestaurantLongitude()
            );

            if (nearestDriver == null) {
                ride.setStatus(RIDE_STATUS.CANCELLED); // Cập nhật trạng thái chuyến đi thành đã hủy
            } else {
                ride.setDriver(nearestDriver); // Cập nhật tài xế cho chuyến đi
                if (order != null) {
                    order.setDriverdto(DtoMapper.toDriverDto(nearestDriver)); // Cập nhật thông tin tài xế cho đơn hàng
                    orderRepository.save(order); // Lưu thông tin đơn hàng
                }
            }

            rideRepository.save(ride); // Lưu thông tin chuyến đi
        } catch (Exception e) {
            throw new RuntimeException("Error processing decline ride: " + e.getMessage());
        }
    }



    @Override
    public void startRide(Long rideId) { // Bắt đầu chuyến đi
        try {
            Ride ride = findRideById(rideId); // Tìm chuyến đi theo ID
            ride.setStatus(RIDE_STATUS.STARTED); // Cập nhật trạng thái chuyến đi thành đã bắt đầu
            ride.getOrder().setOrderStatus(ORDER_STATUS.DELIVERING.toString()); // Cập nhật trạng thái đơn hàng thành đang giao hàng
            ride.setStartTime(LocalDateTime.now()); // Cập nhật thời gian bắt đầu chuyến đi
            rideRepository.save(ride); // Lưu thông tin chuyến đi
            orderRepository.save(ride.getOrder()); // Lưu thông tin đơn hàng
        }
        catch (Exception e) {
            throw new RuntimeException("Error in starting ride");
        }
    }

    @Override
    public void completeRide(Long rideId, List<String> images, String comment) { // Hoàn thành chuyến đi
        try {
            Ride ride = findRideById(rideId); // Tìm chuyến đi theo ID
            Driver driver = ride.getDriver(); // Lấy thông tin tài xế
            driver.setLatitude(ride.getDestinationLatitude()); // Cập nhật vĩ độ của tài xế
            driver.setLongitude(ride.getDestinationLongitude()); // Cập nhật kinh độ của tài xế
            driver.setCurrentRide(null); // Cập nhật chuyến đi hiện tại của tài xế thành null
            ride.setStatus(RIDE_STATUS.COMPLETED); // Cập nhật trạng thái chuyến đi thành đã hoàn thành
            ride.setEndTime(LocalDateTime.now()); // Cập nhật thời gian kết thúc chuyến đi

            driver.getRides().add(ride);
            if (driver.getTotalRevenue() == null) {
                driver.setTotalRevenue(0L);
            }

            if (images == null) {
                throw new RuntimeException("Images must not be null");
            } else {
                ride.setImages(images);
                ride.getOrder().setImages(images);
            }

            if (!comment.isEmpty()) {
                ride.getOrder().setComment(comment);
                ride.getOrder().setOrderStatus(ORDER_STATUS.CANCELLED.toString()); // Cập nhật trạng thái đơn hàng thành đã hủy
            } else {
                ride.getOrder().setOrderStatus(ORDER_STATUS.COMPLETED.toString()); // Cập nhật trạng thái đơn hàng thành đã hoàn thành
            }

            Long totalRevenue = driver.getTotalRevenue() + Math.round(ride.getFare());
            driver.setTotalRevenue(totalRevenue);

            driverRepository.save(driver);
            rideRepository.save(ride);
            orderRepository.save(ride.getOrder());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
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
