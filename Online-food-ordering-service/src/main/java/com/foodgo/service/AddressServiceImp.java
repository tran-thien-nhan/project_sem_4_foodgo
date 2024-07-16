package com.foodgo.service;

import com.foodgo.model.Address;
import com.foodgo.model.User;
import com.foodgo.repository.AddressRepository;
import com.foodgo.repository.UserRepository;
import com.foodgo.request.AddAddressRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImp implements AddressService {

    @Autowired
    private UserService userService;

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public List<Address> getAllAddressOfThisUser(Long id) throws Exception {
        User user = userService.findUserById(id);
        return user.getAddresses();
    }

    @Override
    public Address findByStreetAddressAndCityAndStateAndPinCode(String streetAddress, String city, String state, String pinCode, Long id) throws Exception {
        List<Address> addresses = getAllAddressOfThisUser(id);
        for (Address address : addresses) {
            if (address.getStreetAddress().equals(streetAddress) && address.getCity().equals(city) && address.getState().equals(state) && address.getPinCode().equals(pinCode)) {
                return address;
            }
        }
        return null;
    }

    @Override
    public Address addAddress(AddAddressRequest req, Long userId) throws Exception {
        User user = userService.findUserById(userId);

        // Kiểm tra xem địa chỉ đã tồn tại chưa
        boolean addressExists = user.getAddresses().stream().anyMatch(existingAddress ->
                        existingAddress.getCity().equalsIgnoreCase(req.getCity()) &&
                        existingAddress.getStreetAddress().equalsIgnoreCase(req.getStreetAddress()) &&
                        existingAddress.getState().equalsIgnoreCase(req.getState()) &&
                        existingAddress.getPinCode().equalsIgnoreCase(req.getPinCode()) &&
                        existingAddress.getCountry().equalsIgnoreCase(req.getCountry())
//                        existingAddress.getPhone().equalsIgnoreCase(req.getPhone())
        );

        // Nếu địa chỉ đã tồn tại, không thêm mới
        if (addressExists) {
            throw new Exception("Địa chỉ đã tồn tại.");
        }

        // Nếu địa chỉ chưa tồn tại, thêm mới
        Address address = new Address();
        address.setCity(req.getCity());
        address.setStreetAddress(req.getStreetAddress());
        address.setState(req.getState());
        address.setPinCode(req.getPinCode());
        address.setCountry(req.getCountry());
//        address.setPhone(req.getPhone());
//        address.setLatitude(req.getLatitude());
//        address.setLongitude(req.getLongitude());
        address.setUser(user);  // Set the user of the address
        user.getAddresses().add(address); // Add the address to the user's list of addresses
        addressRepository.save(address);  // Save the new address to the database

        return address;
    }


    @Override
    public Address updateAddress(Long addressId, AddAddressRequest req) throws Exception {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new Exception("Address not found"));

        address.setCity(req.getCity());
        address.setStreetAddress(req.getStreetAddress());
        address.setState(req.getState());
        address.setPinCode(req.getPinCode());
        address.setCountry(req.getCountry());
//        address.setPhone(req.getPhone());

        return addressRepository.save(address);  // Save the updated address to the database
    }

    @Override
    public void deleteAddress(Long addressId) throws Exception {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new Exception("Address not found"));

        // Kiểm tra nếu có ràng buộc khóa ngoại
        try {
            addressRepository.delete(address);  // Thử xóa địa chỉ từ cơ sở dữ liệu
        } catch (DataIntegrityViolationException e) {
            // Nếu xảy ra lỗi ràng buộc khóa ngoại, xóa user_id để địa chỉ không hiển thị trên giao diện người dùng
            address.setUser(null);
            addressRepository.save(address);
        }
    }


    @Override
    public Address findByStreetAddressAndCityAndStateAndPinCode(String streetAddress, String city, String state, String pinCode) throws Exception {
        List<Address> addresses = addressRepository.findAll();
        for (Address address : addresses) {
            if (address.getStreetAddress().equals(streetAddress) && address.getCity().equals(city) && address.getState().equals(state) && address.getPinCode().equals(pinCode)) {
                return address;
            }
        }
        return null;
    }
}
