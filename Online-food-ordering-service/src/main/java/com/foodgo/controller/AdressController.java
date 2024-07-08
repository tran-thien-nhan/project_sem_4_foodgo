package com.foodgo.controller;

import com.foodgo.model.Address;
import com.foodgo.model.User;
import com.foodgo.request.AddAddressRequest;
import com.foodgo.service.AddressService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AdressController {
    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

    @GetMapping("/user")
    public ResponseEntity<List<Address>> getAllAddressesOfUser(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            if (user == null) {
                throw new Exception("User not found");
            }
            List<Address> addresses = addressService.getAllAddressOfThisUser(user.getId());
            return new ResponseEntity<>(addresses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Address> addAddress(
            @RequestBody AddAddressRequest req,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            if (user == null) {
                throw new Exception("User not found");
            }
            Address address = addressService.addAddress(req, user.getId());
            return new ResponseEntity<>(address, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update/{addressId}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Long addressId,
            @RequestBody AddAddressRequest req,
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            if (user == null) {
                throw new Exception("User not found");
            }
            Address address = addressService.updateAddress(addressId, req);
            return new ResponseEntity<>(address, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId,
                                              @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt);
            if (user == null) {
                throw new Exception("User not found");
            }
            addressService.deleteAddress(addressId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
