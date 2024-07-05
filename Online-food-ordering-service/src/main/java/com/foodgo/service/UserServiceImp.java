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
import com.foodgo.response.ResetpasswordResponse;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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

    @Autowired
    private EmailService emailService;

    @Autowired //tự động tìm kiếm và inject PasswordEncoder vào AuthController để sử dụng
    private PasswordEncoder passwordEncoder;

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

    public void processForgotPassword(String email) throws MessagingException, UnsupportedEncodingException {
        try{
            User user = userRepository.findByEmailAndProvider(email, PROVIDER.NORMAL).get(0);
            System.out.println("user: " + user);

            if(user == null) {
                throw new BadCredentialsException("User not found with email " + email);
            }

            String token = UUID.randomUUID().toString();
            // Save token to database with expiration time
            user.setResetPasswordToken(token);
            user.setResetPasswordExpires(new Date(System.currentTimeMillis() + 3600000));
            userRepository.save(user);

            if(user.getResetPasswordExpires() == null && user.getResetPasswordToken() == null) {
                throw new BadCredentialsException("Token not found");
            }

            // Send email with the token link
            emailService.sendPasswordResetEmail(user.getEmail(), token);
        }
        catch (Exception e) {
            System.out.println("Error: " + e);
        }
    }

    public ResetpasswordResponse updatePassword(String token, String newPassword) {
        try {
            User user = userRepository.findByResetPasswordToken(token);
            ResetpasswordResponse response = new ResetpasswordResponse();
            if (user == null || user.getResetPasswordExpires().before(new Date())) {
                response.setMessage("Token is invalid or expired");
                return response;
            }

            user.setPassword(newPassword); // Bạn có thể cần mã hóa mật khẩu trước khi lưu
            user.setResetPasswordToken(null);
            user.setResetPasswordExpires(null);
            userRepository.save(user);

            response.setMessage("Password updated successfully");
            return response;
        } catch (Exception e) {
            System.out.println("Error: " + e);
            ResetpasswordResponse response = new ResetpasswordResponse();
            response.setMessage("Error: " + e);
            return response;
        }
    }


}
