package com.foodgo.repository;

import com.foodgo.model.Driver;
import com.foodgo.model.Ride;
import com.foodgo.model.USER_ROLE;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Driver findByEmail(String email);
    Driver findByPhone(String phone);
    Driver findByEmailAndPassword(String email, String password);
    Driver findByPhoneAndPassword(String phone, String password);

    @Query("SELECT r FROM Ride r WHERE r.driver.id = :driverId AND r.status = 'REQUESTED'")
    public List<Ride> getAllocatedRides(@Param("driverId") Long driverId);

    @Query("SELECT r FROM Ride r WHERE r.driver.id = :driverId AND r.status = 'COMPLETED'")
    public List<Ride> completedRides(@Param("driverId") Long driverId);

    @Query("SELECT r FROM Ride r WHERE r.driver.id = :driverId AND r.status = 'CANCELLED'")
    public List<Ride> cancelledRides(@Param("driverId") Long driverId);

    Driver findByEmailAndRole(String email, USER_ROLE role);
}
