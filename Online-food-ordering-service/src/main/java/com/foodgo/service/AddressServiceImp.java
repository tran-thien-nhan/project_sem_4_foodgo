package com.foodgo.service;

import com.foodgo.model.Address;
import com.foodgo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImp implements AddressService{

    @Autowired
    private UserService userService;

    @Override
    public List<Address> getAllAddressOfThisUser(Long id) throws Exception {
        User user = userService.findUserById(id);
        return user.getAddresses();
    }

    @Override
    public Address findByStreetAddressAndCityAndStateAndPinCode(String streetAddress, String city, String state, String pinCode, Long id) throws Exception {
        List <Address> addresses = getAllAddressOfThisUser(id);
        for (Address address : addresses) {
            if (address.getStreetAddress().equals(streetAddress) && address.getCity().equals(city) && address.getState().equals(state) && address.getPinCode().equals(pinCode)) {
                return address;
            }
        }
        return null;
    }
}
