package com.foodgo.service;

import com.foodgo.config.JwtProvider;
import com.foodgo.model.User;
import com.foodgo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwtToken) throws Exception {
        // Kiểm tra xem jwtProvider đã được khởi tạo chưa
        if (jwtProvider == null) {
            throw new Exception("JwtProvider is not initialized");
        }

        String email = jwtProvider.getEmailFromJwtToken(jwtToken);
        User user = userRepository.findByEmail(email);
        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User not found with email " + email);
        }
        return user;
    }

    @Override
    public User findUserById(Long id) throws Exception {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new Exception("User not found with id " + id);
        }
        return user;
    }
}
