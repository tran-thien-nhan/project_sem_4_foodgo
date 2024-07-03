package com.foodgo.controller;

import com.foodgo.config.JwtProvider;
import com.foodgo.model.Cart;
import com.foodgo.model.PROVIDER;
import com.foodgo.model.USER_ROLE;
import com.foodgo.model.User;
import com.foodgo.repository.CartRepository;
import com.foodgo.repository.UserRepository;
import com.foodgo.request.GoogleLoginRequest;
import com.foodgo.request.LoginRequest;
import com.foodgo.response.AuthResponse;
import com.foodgo.service.CustomerUserDetailsService;
import com.foodgo.service.UserService;
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
import java.util.List;

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
    @Autowired
    private UserService userService;

    @PostMapping("/signup") //đánh dấu phương thức createUserHandler là phương thức xử lý request POST tới /auth/signup
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {

        // AuthResponse là một class chứa thông tin về token và message

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        //User isEmailExist = userRepository.findByEmail(user.getEmail()); //kiểm tra xem email đã tồn tại trong database chưa
        //User isEmailExist = userRepository.findByEmailAndProvider(user.getEmail(), user.getProvider()).get(0); // kiểm tra xem email và provider đã tồn tại trong database chưa
        List<User> existingUsers = userRepository.findByEmailAndProvider(user.getEmail(), user.getProvider());
        if (!existingUsers.isEmpty()) { //nếu email đã tồn tại

            // chuyển sang sign in
            LoginRequest req = new LoginRequest();
            req.setEmail(user.getEmail());
            req.setPassword(user.getPassword());
            req.setProvider(user.getProvider());
            return signinForSignup(req);
        }

        // còn nếu chua co email, tạo mới
        User createdUser = new User(); //tạo một user mới
        createdUser.setEmail(user.getEmail()); //set email cho user mới
        createdUser.setFullName(user.getFullName()); //set fullName cho user mới
        createdUser.setRole(user.getRole()); //set role cho user mới

        if(user.getPassword() != null && !user.getPassword().isEmpty()){
            createdUser.setPassword(passwordEncoder.encode(user.getPassword())); //set password cho user mới, mã hóa password trước khi lưu vào database
        }

        createdUser.setProvider(user.getProvider()); // set provider cho user mới

        User savedUser = userRepository.save(createdUser); //lưu user mới vào database

        Cart cart = new Cart(); //tạo một cart mới
        cart.setCustomer(savedUser); //set customer cho cart mới
        cartRepository.save(cart); //lưu cart mới vào database

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()); //tạo ra một đối tượng Authentication từ email và password của user
        SecurityContextHolder.getContext().setAuthentication(authentication); //set Authentication vào SecurityContextHolder để xác thực user
        String jwt = jwtProvider.generateToken(authentication, user.getProvider()); //tạo ra token từ thông tin user
        AuthResponse authResponse = new AuthResponse(); //tạo ra một đối tượng AuthResponse
        authResponse.setJwt(jwt); //set jwt cho AuthResponse
        authResponse.setMessage("Sign Up successfully"); //set message cho AuthResponse
        authResponse.setRole(savedUser.getRole()); //set role cho AuthResponse

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED); //trả về AuthResponse và status code 200 (OK)
    }

    @PostMapping("/signin") //đánh dấu phương thức signin là phương thức xử lý request POST tới /auth/signin
    public ResponseEntity<User> signin(@RequestBody LoginRequest req) {

        if(req.getProvider() == PROVIDER.GOOGLE){
            GoogleLoginRequest googleLoginRequest = new GoogleLoginRequest();
            googleLoginRequest.setEmail(req.getEmail());
            googleLoginRequest.setProvider(PROVIDER.GOOGLE);
            googleLoginRequest.setFullName(req.getEmail());
            googleLoginRequest.setRole(USER_ROLE.ROLE_CUSTOMER);
            return googleSignIn(googleLoginRequest);
        }

        String username = req.getEmail(); //lấy email từ request
        String email = req.getEmail(); //lấy email từ request
        String password = req.getPassword(); //lấy password từ request
        PROVIDER provider = req.getProvider(); //lấy provider từ request

        //User user = findUserByEmailAndProvider(email, provider); //tìm user theo email và provider (google hoặc normal
        User user = userRepository.findByEmailAndProvider(email, provider).get(0);

        Authentication authentication = authenticateByEmailAndProvider(email, password, provider); //xác thực user
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities(); //lấy danh sách các quyền của user
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority(); //lấy quyền của user
        String jwt = jwtProvider.generateToken(authentication, provider); //tạo ra token từ thông tin user

        AuthResponse authResponse = new AuthResponse(); //tạo ra một đối tượng AuthResponse
        authResponse.setJwt(jwt); //set jwt cho AuthResponse
        authResponse.setMessage("Sign In successfully"); //set message cho AuthResponse
        authResponse.setRole(USER_ROLE.valueOf(role)); //set role cho AuthResponse

        return new ResponseEntity(authResponse, HttpStatus.OK); //trả về AuthResponse và status code 200 (OK), authResponse chứa thông tin user và token
    }

    @PostMapping("/google-signin")
    public ResponseEntity<User> googleSignIn(@RequestBody GoogleLoginRequest request) {
        try {
            // Xử lý đăng nhập bằng Google
            return processGoogleLogin(request);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/get-oauth-token")
    public ResponseEntity<User> getOauthToken(@RequestBody GoogleLoginRequest request) {
        try {
            return processGoogleLogin(request);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
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

    private ResponseEntity<User> processGoogleLogin(GoogleLoginRequest request) throws Exception {
        //User user = findUserByEmailAndProvider(request.getEmail(), PROVIDER.GOOGLE);
        User user = userRepository.findByEmailAndProvider(request.getEmail(), request.getProvider()).get(0);
        //User user = findUserByEmailAndProvider(request.getEmail(), request.getProvider());
        if (user == null) {
            // Nếu người dùng chưa tồn tại, tạo mới
            user = new User();
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setProvider(PROVIDER.GOOGLE);
            userRepository.save(user);

            Cart cart = new Cart(); //tạo một cart mới
            cart.setCustomer(user); //set customer cho cart mới
            cartRepository.save(cart); //lưu cart mới vào database
        }
        // Tạo JWT token và trả về thông tin người dùng
        String email = user.getEmail();
        String password = user.getPassword();
        PROVIDER provider = user.getProvider();

        Authentication authentication = authenticateByEmailAndProvider(email,password,provider);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        String jwt = jwtProvider.generateToken(authentication, provider);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Sign In successfully");
        authResponse.setRole(USER_ROLE.valueOf(role));

        return new ResponseEntity(authResponse, HttpStatus.OK);
    }

    private Authentication authenticateByEmailAndProvider(String email,String password, PROVIDER provider) {
        UserDetails userDetails = customerUserDetailsService.loadUserByEmailAndProvider(email,password,provider);
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid account");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    private User findUserByEmailAndProvider(String email, PROVIDER provider) {
        List<User> users = userRepository.findByEmailAndProvider(email, provider);
        if (users.size() == 1) {
            return users.get(0);
        } else if (users.size() > 1) {
            throw new IllegalStateException("Multiple users found with the same email and provider");
        } else {
            return null;
        }
    }


    private ResponseEntity<AuthResponse> signinForSignup(LoginRequest req) {
        //User user = findUserByEmailAndProvider(req.getEmail(), req.getProvider());
        User user = userRepository.findByEmailAndProvider(req.getEmail(), req.getProvider()).get(0);

        if (user == null) {
            throw new BadCredentialsException("Invalid account");
        }

        Authentication authentication = authenticateByEmailAndProvider(user.getEmail(), req.getPassword(), req.getProvider());
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        String jwt = jwtProvider.generateToken(authentication, req.getProvider());

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Sign In successfully");
        authResponse.setRole(user.getRole());

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }


}
