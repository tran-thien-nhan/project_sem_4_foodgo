package com.foodgo.service;

import com.foodgo.config.JwtProvider;
import com.foodgo.model.Cart;
import com.foodgo.model.PROVIDER;
import com.foodgo.model.USER_ROLE;
import com.foodgo.model.User;
import com.foodgo.repository.CartRepository;
import com.foodgo.repository.UserRepository;
import com.foodgo.request.GoogleLoginRequest;
import com.foodgo.response.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CartRepository cartRepository;

    @Autowired //tự động tìm kiếm và inject CustomerUserDetailsService vào AuthController để sử dụng
    private CustomerUserDetailsService customerUserDetailsService;

    @Override
    public User findUserByJwtToken(String jwtToken) throws Exception {
        // Kiểm tra xem jwtProvider đã được khởi tạo chưa
        if (jwtProvider == null) {
            throw new Exception("JwtProvider is not initialized");
        }

        String email = jwtProvider.getEmailFromJwtToken(jwtToken);
        PROVIDER provider = jwtProvider.getProviderFromJwtToken(jwtToken);
        User user = userRepository.findByEmailAndProvider(email, provider).get(0);
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
