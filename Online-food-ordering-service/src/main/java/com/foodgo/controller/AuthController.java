package com.foodgo.controller;

import com.foodgo.config.JwtProvider;
import com.foodgo.model.Cart;
import com.foodgo.model.USER_ROLE;
import com.foodgo.model.User;
import com.foodgo.repository.CartRepository;
import com.foodgo.repository.UserRepository;
import com.foodgo.request.LoginRequest;
import com.foodgo.response.AuthResponse;
import com.foodgo.service.CustomerUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired //tự động tìm kiếm và inject UserRepository vào AuthController để sử dụng
    private UserRepository userRepository;
    @Autowired //tự động tìm kiếm và inject PasswordEncoder vào AuthController để sử dụng
    private PasswordEncoder passwordEncoder;
    @Autowired //tự động tìm kiếm và inject JwtProvider vào AuthController để sử dụng
    private JwtProvider jwtProvider;
    @Autowired //tự động tìm kiếm và inject CustomerUserDetailsService vào AuthController để sử dụng
    private CustomerUserDetailsService customerUserDetailsService;
    @Autowired //tự động tìm kiếm và inject CartRepository vào AuthController để sử dụng
    private CartRepository cartRepository;

    @PostMapping("/signup") //đánh dấu phương thức createUserHandler là phương thức xử lý request POST tới /auth/signup
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {
        User isEmailExist = userRepository.findByEmail(user.getEmail()); //kiểm tra xem email đã tồn tại trong database chưa
        if (isEmailExist != null) { //nếu email đã tồn tại
            throw new Exception("Email is already used with another account"); //ném ra lỗi "Email already exist"
        }

        User createdUser = new User(); //tạo một user mới
        createdUser.setEmail(user.getEmail()); //set email cho user mới
        createdUser.setFullName(user.getFullName()); //set fullName cho user mới
        createdUser.setRole(user.getRole()); //set role cho user mới
        createdUser.setPassword(passwordEncoder.encode(user.getPassword())); //set password cho user mới, mã hóa password trước khi lưu vào database

        User savedUser = userRepository.save(createdUser); //lưu user mới vào database

        Cart cart = new Cart(); //tạo một cart mới
        cart.setCustomer(savedUser); //set customer cho cart mới
        cartRepository.save(cart); //lưu cart mới vào database

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()); //tạo ra một đối tượng Authentication từ email và password của user
        SecurityContextHolder.getContext().setAuthentication(authentication); //set Authentication vào SecurityContextHolder để xác thực user
        String jwt = jwtProvider.generateToken(authentication); //tạo ra token từ thông tin user
        AuthResponse authResponse = new AuthResponse(); //tạo ra một đối tượng AuthResponse
        authResponse.setJwt(jwt); //set jwt cho AuthResponse
        authResponse.setMessage("Sign Up successfully"); //set message cho AuthResponse
        authResponse.setRole(savedUser.getRole()); //set role cho AuthResponse

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED); //trả về AuthResponse và status code 200 (OK)
    }

    @PostMapping("/signin") //đánh dấu phương thức signin là phương thức xử lý request POST tới /auth/signin
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest req) {

        String username = req.getEmail();
        String password = req.getPassword();

        Authentication authentication = authenticate(username, password);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        String jwt = jwtProvider.generateToken(authentication); //tạo ra token từ thông tin user

        AuthResponse authResponse = new AuthResponse(); //tạo ra một đối tượng AuthResponse
        authResponse.setJwt(jwt); //set jwt cho AuthResponse
        authResponse.setMessage("Sign In successfully"); //set message cho AuthResponse
        authResponse.setRole(USER_ROLE.valueOf(role)); //set role cho AuthResponse

        return new ResponseEntity<>(authResponse, HttpStatus.OK); //trả về AuthResponse và status code 200 (OK)
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }


}
