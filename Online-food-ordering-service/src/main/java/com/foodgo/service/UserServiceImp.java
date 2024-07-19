package com.foodgo.service;

import com.foodgo.config.JwtProvider;
import com.foodgo.dto.EventDto;
import com.foodgo.model.*;
import com.foodgo.repository.CartRepository;
import com.foodgo.repository.EventRepository;
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
import java.util.stream.Collectors;

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

    @Autowired
    private EventRepository eventRepository;

    @Autowired //tự động tìm kiếm và inject PasswordEncoder vào AuthController để sử dụng
    private PasswordEncoder passwordEncoder;

    @Override
    public User findUserByJwtToken(String jwtToken) throws Exception {
        if (jwtProvider == null) {
            throw new Exception("JwtProvider is not initialized");
        }

        String email = jwtProvider.getEmailFromJwtToken(jwtToken);
        PROVIDER provider = jwtProvider.getProviderFromJwtToken(jwtToken);
        User user = userRepository.findByEmailAndProvider(email, provider).get(0);

        // Lấy danh sách nhà hàng yêu thích của user
        List<Long> favoriteRestaurantIds = user.getFavorites().stream()
                .map(fav -> fav.getId())
                .collect(Collectors.toList());

        // Lấy các sự kiện của những nhà hàng nằm trong danh sách yêu thích
        List<Event> favoriteEvents = eventRepository.findByRestaurantIdIn(favoriteRestaurantIds);

        // Chuyển đổi danh sách Event thành danh sách EventDto
        List<EventDto> favoriteEventDtos = favoriteEvents.stream().map(event -> {
            EventDto eventDto = new EventDto();
            eventDto.setId(event.getId());
            eventDto.setName(event.getName());
            eventDto.setLocation(event.getLocation());
            eventDto.setDescription(event.getDescription());
            eventDto.setStartedAt(event.getStartedAt());
            eventDto.setEndsAt(event.getEndsAt());
            eventDto.setImages(event.getImages());
            eventDto.setOfRestaurant(event.getRestaurant().getName());
            return eventDto;
        }).collect(Collectors.toList());

        // Gán danh sách EventDto vào user
        user.setEventDto(favoriteEventDtos);

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
        try {
            if (email == null || email.isEmpty()) {
                throw new BadCredentialsException("Email is null or empty");
            }
            List<User> users = findByEmailAndProvider(email, PROVIDER.NORMAL);
            if (users.isEmpty()) {
                throw new BadCredentialsException("User not found with email " + email);
            }

            User user = users.get(0);
            System.out.println("user: " + user);

            String token = UUID.randomUUID().toString();
            // Save token to database with expiration time
            user.setResetPasswordToken(token);
            user.setResetPasswordExpires(new Date(System.currentTimeMillis() + 3600000));
            userRepository.save(user);

            if (user.getResetPasswordExpires() == null || user.getResetPasswordToken() == null) {
                throw new BadCredentialsException("Token not found");
            }

            // Send email with the token link
            emailService.sendPasswordResetEmail(user.getEmail(), token);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            throw e;
        }
    }

//    private List<User> findByEmailAndProvider(String email, PROVIDER provider) {
//        List<User> users = userRepository.findAll();
//        return users.stream()
//                .filter(user -> user.getEmail().equals(email) && user.getProvider().equals(provider))
//                .collect(Collectors.toList());
//    }

    private List<User> findByEmailAndProvider(String email, PROVIDER provider) {
        return userRepository.findByEmailAndProvider(email, provider);
    }


    public ResetpasswordResponse updatePassword(String token, String newPassword) throws Exception {
        User user = userRepository.findByResetPasswordToken(token);
        if (user == null || user.getResetPasswordExpires().before(new Date())) {
            throw new BadCredentialsException("Token is invalid or expired");
        }

        // Kiểm tra nếu mật khẩu mới đã được sử dụng trong 5 lần gần nhất
        int passwordCheckLimit = 5;
        int checkStartIndex = Math.max(0, user.getPreviousPasswords().size() - passwordCheckLimit);
        List<String> recentPasswords = user.getPreviousPasswords().subList(checkStartIndex, user.getPreviousPasswords().size());
        for (String previousPassword : recentPasswords) {
            if (passwordEncoder.matches(newPassword, previousPassword)) {
                throw new BadCredentialsException("You have used this password before");
            }
        }
        user.getPreviousPasswords().add(user.getPassword());

        user.setPassword(passwordEncoder.encode(newPassword)); // Bạn có thể cần mã hóa mật khẩu trước khi lưu
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        userRepository.save(user);

        ResetpasswordResponse response = new ResetpasswordResponse();
        response.setMessage("Password updated successfully");
        return response;
    }

    @Override
    public User findByEmailAndProvider(String email, String password, PROVIDER provider) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getEmail().equals(email) && user.getPassword().equals(password) && user.getProvider().equals(provider))
                .findFirst()
                .orElse(null);
    }

//    @Override
//    public Boolean checkPhone(String phone) throws Exception {
//        User user = userRepository.findByPhone(phone);
//        if (user == null) {
//            return false;
//        }
//        return true;
//    }
}
