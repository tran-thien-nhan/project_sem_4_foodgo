package com.foodgo.service;

import com.foodgo.model.Driver;
import com.foodgo.model.Restaurant;
import com.foodgo.model.Ride;
import com.foodgo.model.User;
import com.foodgo.request.RideRequest;

public interface RideService {

    public Ride requestRide(RideRequest rideRequest);

    public Ride createRideRequest(Driver nearestDriver,
                                  double restaurantLatitude,
                                  double restaurantLongitude,
                                  double destinationLatitude,
                                  double destinationLongitude,
                                  RideRequest rideRequest);

    public Ride findRideById(Long id) throws Exception;
    public void acceptRide(Long rideId);
    public void declineRide(Long rideId, Long driverId);
    public void startRide(Long rideId);
    public void completeRide(Long rideId);
    public void cancelRide(Long rideId);
}
