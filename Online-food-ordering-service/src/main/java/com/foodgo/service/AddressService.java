package com.foodgo.service;

import com.foodgo.model.Address;

import java.util.List;

public interface AddressService {
    public List<Address> getAllAddressOfThisUser(Long id) throws Exception;

    // tạo hàm findByStreetAddressAndCityAndStateAndPinCode(String streetAddress, String city, String state, String pinCode) ở đây
    public Address findByStreetAddressAndCityAndStateAndPinCode(String streetAddress, String city, String state, String pinCode, Long id) throws Exception;
}
