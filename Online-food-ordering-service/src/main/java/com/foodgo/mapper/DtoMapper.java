package com.foodgo.mapper;

import com.foodgo.dto.*;
import com.foodgo.model.*;

import java.util.List;
import java.util.stream.Collectors;

public class DtoMapper {
//    public static DriverDto toDriverDto(Driver driver) {
//        DriverDto driverDto = new DriverDto();
//        driverDto.setDriverId(driver.getId());
//        driverDto.setName(driver.getName());
//        driverDto.setPhone(driver.getPhone());
//        driverDto.setEmail(driver.getEmail());
//        driverDto.setVehicle(driver.getVehicle());
//        driverDto.setLatitude(driver.getLatitude());
//        driverDto.setLongitude(driver.getLongitude());
//        return driverDto;
//    }

    public static RideDto toRideDto(Ride ride) {
        RideDto rideDto = new RideDto();
        rideDto.setRideId(ride.getId());
        rideDto.setDriverId(ride.getDriver().getId());
        rideDto.setRestaurantId(ride.getRestaurant().getId());
        rideDto.setOrderId(ride.getOrder().getId());
        rideDto.setRestaurantLatitude(ride.getRestaurantLatitude());
        rideDto.setRestaurantLongitude(ride.getRestaurantLongitude());
        rideDto.setDestinationLatitude(ride.getDestinationLatitude());
        rideDto.setDestinationLongitude(ride.getDestinationLongitude());
        rideDto.setUserAddress(ride.getUserAddress());
        rideDto.setRestaurantAddress(ride.getRestaurantAddress());
        rideDto.setDistance(ride.getDistance());
        rideDto.setDuration(ride.getDuration());
        rideDto.setStartTime(ride.getStartTime());
        rideDto.setEndTime(ride.getEndTime());
        rideDto.setFare(ride.getFare());
        rideDto.setTotal(ride.getTotal());
        rideDto.setStatus(ride.getStatus());
        rideDto.setOrderItem(toOrderItemDtos(ride.getOrder().getItems()));
        rideDto.setPaymentMethod(ride.getOrder().getPaymentMethod());
        rideDto.setOrderStatus(ride.getOrder().getOrderStatus());
        return rideDto;
    }

    private static List<OrderItemDto> toOrderItemDtos(List<OrderItem> items) {
        return items.stream().map(item -> {
            OrderItemDto orderItemDto = new OrderItemDto();
            orderItemDto.setItemId(item.getId());
            orderItemDto.setItemName(item.getFood().getName());
            orderItemDto.setItemPrice(item.getTotalPrice());
            orderItemDto.setIngredientsName(item.getIngredients());
            orderItemDto.setItemQuantity(item.getQuantity());
            return orderItemDto;
        }).collect(Collectors.toList());
    }

    public static EventDto toEventDto(Event event) {
        EventDto eventDto = new EventDto();
        eventDto.setId(event.getId());
        eventDto.setName(event.getName());
        eventDto.setLocation(event.getLocation());
        eventDto.setDescription(event.getDescription());
        eventDto.setOfRestaurant(event.getRestaurant().getName());
        eventDto.setEventLimit(event.getEventLimit());
        eventDto.setIsFull(event.isFull());
        eventDto.setIsAvailable(event.isAvailable());
        eventDto.setStartedAt(event.getStartedAt());
        eventDto.setEndsAt(event.getEndsAt());
        eventDto.setImages(event.getImages());
        eventDto.setTotalFavorites(event.getTotalFavorites());
        return eventDto;
    }

    public static EventDto updateEventDto(Event event) {
        EventDto eventDto = new EventDto();
        eventDto.setId(event.getId());
        eventDto.setName(event.getName());
        eventDto.setLocation(event.getLocation());
        eventDto.setDescription(event.getDescription());
        eventDto.setOfRestaurant(event.getRestaurant().getName());
        eventDto.setEventLimit(event.getEventLimit());
        eventDto.setIsFull(event.isFull());
        eventDto.setIsAvailable(event.isAvailable());
        eventDto.setStartedAt(event.getStartedAt());
        eventDto.setEndsAt(event.getEndsAt());
        eventDto.setImages(event.getImages());
        eventDto.setTotalFavorites(event.getTotalFavorites());
        return eventDto;
    }

//    private static UserDto toUserDto(User user) {
//        UserDto userDto = new UserDto();
//        userDto.setUserId(user.getId());
//        userDto.setFullName(user.getFullName());
//        userDto.setPhone(user.getPhone());
//        userDto.setAddresses(user.getAddresses().stream()
//                .map(DtoMapper::toAddressDto)
//                .collect(Collectors.toList()));
//        return userDto;
//    }
//
//    public static AddressDto toAddressDto(Address address) {
//        AddressDto addressDto = new AddressDto();
//        addressDto.setId(address.getId());
//        addressDto.setCity(address.getCity());
//        addressDto.setStreetAddress(address.getStreetAddress());
//        addressDto.setState(address.getState());
//        addressDto.setPinCode(address.getPinCode());
//        addressDto.setCountry(address.getCountry());
//        addressDto.setPhone(address.getPhone());
//        addressDto.setLatitude(address.getLatitude());
//        addressDto.setLongitude(address.getLongitude());
//        return addressDto;
//    }
//
//    private static RestaurantDto toRestaurantDto(Restaurant restaurant) {
//        RestaurantDto restaurantDto = new RestaurantDto();
//        restaurantDto.setId(restaurant.getId());
//        restaurantDto.setTitle(restaurant.getName());
//        restaurantDto.setPhone(restaurant.getPhone());
//        restaurantDto.setAddress(restaurant.getAddress());
//        restaurantDto.setCity("ho chi minh");
//        restaurantDto.setTotalFavorites(restaurant.getTotalFavorites());
//        return restaurantDto;
//    }
//
//    private static OrderDto toOrderDto(Order order) {
//        OrderDto orderDto = new OrderDto();
//        orderDto.setId(order.getId());
//        orderDto.setTotalAmount(order.getTotalAmount());
//        orderDto.setUserPhone(order.getCustomer().getPhone());
//        orderDto.setRestaurantPhone(order.getRestaurant().getPhone());
//        orderDto.setPaymentMethod(order.getPaymentMethod());
//        orderDto.setOrderStatus(order.getOrderStatus());
//        orderDto.setCreatedAt(order.getCreatedAt());
//        orderDto.setStreetAddress(order.getDeliveryAddress().getStreetAddress());
//        List<OrderItemDto> orderItemDtos = DtoMapper.toOrderItemDtos(order.getItems());
//        orderDto.setOrderItems(orderItemDtos);
//        return orderDto;
//    }
//
}
