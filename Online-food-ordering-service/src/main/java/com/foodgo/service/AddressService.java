package com.foodgo.service;

import com.foodgo.model.Address;
import com.foodgo.request.AddAddressRequest;

import java.util.List;

public interface AddressService {
    public List<Address> getAllAddressOfThisUser(Long id) throws Exception;
    public Address findByStreetAddressAndCityAndStateAndPinCode(String streetAddress, String city, String state, String pinCode, Long id) throws Exception;

    //create new address
    public Address addAddress(AddAddressRequest req, Long userId) throws Exception;

    //update address
    public Address updateAddress(Long addressId, AddAddressRequest req) throws Exception;

    //delete address
    public void deleteAddress(Long addressId) throws Exception;

    //findByStreetAddressAndCityAndStateAndPinCode
    public Address findByStreetAddressAndCityAndStateAndPinCode(String streetAddress, String city, String state, String pinCode) throws Exception;
}
