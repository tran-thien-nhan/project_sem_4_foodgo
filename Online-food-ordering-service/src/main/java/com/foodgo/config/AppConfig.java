package com.foodgo.config;

// mục đích của class này là để cấu hình cho ứng dụng Spring Boot
// để nó biết nơi chứa các file cấu hình, nơi chứa các file controller, nơi chứa các file service, nơi chứa các file repository
// và nó sẽ quét toàn bộ ứng dụng để tìm các file controller, service, repository để quản lý
// để cấu hình cho ứng dụng Spring Boot, ta sử dụng annotation @Configuration

import com.foodgo.service.TwoFactorAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.*;

@Configuration // đánh dấu class này là class cấu hình, nó sẽ được Spring Boot quét và đọc để cấu hình cho ứng dụng
@EnableWebSecurity // bật tính năng bảo mật trên ứng dụng, nó sẽ quét toàn bộ ứng dụng để tìm các file cấu hình bảo mật
public class AppConfig {

    @Autowired
    private TwoFactorAuthService twoFactorAuthService;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { // cấu hình bảo mật cho ứng dụng, nó sẽ được Spring Boot gọi khi ứng dụng khởi động
        http
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // tắt session trên ứng dụng, không lưu session trên server, STATELESS là không lưu session
                .authorizeHttpRequests(authorize -> authorize // cấu hình cho việc xác thực người dùng, phân quyền truy cập, bảo mật trên ứng dụng
                        .requestMatchers("/api/sup-admin/**").hasAnyRole("ADMIN") // chỉ cho phép người dùng có role là ADMIN truy cập vào các API bắt đầu bằng /api/sup-admin
                        .requestMatchers("/api/admin/**").hasAnyRole("RESTAURANT_OWNER", "SHIPPER") // chỉ cho phép người dùng có role là ADMIN hoặc RESTAURANT_OWNER truy cập vào các API bắt đầu bằng /api/admin
                        .requestMatchers("/auth/signup").permitAll() // cho phép mọi người dùng truy cập vào endpoint /auth/signup mà không cần xác thực
                        .requestMatchers("/auth/verify-2fa").permitAll() // cho phép mọi người dùng truy cập vào endpoint /auth/verify-2fa mà không cần xác thực
                        .requestMatchers("/api/public/**").permitAll() // cho phép mọi người dùng truy cập vào các API bắt đầu bằng /public
                        .requestMatchers("/api/**").authenticated() // chỉ cho phép người dùng đã xác thực truy cập vào các API bắt đầu bằng /api
                        .anyRequest().permitAll() // cho phép tất cả mọi người dùng truy cập vào các API khác
                )
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class) // thêm filter JwtTokenValidator vào trước BasicAuthenticationFilter để kiểm tra token của người dùng
                .csrf(csrf -> csrf.disable()) // tắt tính năng bảo mật CSRF trên ứng dụng
                .cors(cors -> cors.configurationSource(corsConfigurationSource())); // cấu hình cho CORS trên ứng dụng
        return http.build(); // trả về đối tượng SecurityFilterChain đã được cấu hình
    }

    private CorsConfigurationSource corsConfigurationSource() { // cấu hình cho CORS, cho phép truy cập từ domain http://localhost:3000, hoặc vercel "https://foodgo.vercel.app"
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) { // cấu hình cho CORS, cho phép truy cập từ domain http://localhost:3000, hoặc vercel "https://foodgo.vercel.app"
                CorsConfiguration cfg = new CorsConfiguration(); // tạo ra một đối tượng CorsConfiguration để cấu hình cho CORS
                cfg.setAllowedOrigins(Arrays.asList( // cho phép truy cập từ domain http://localhost:3000, hoặc vercel "https://foodgo.vercel.app"
                        "https://foodgo.vercel.app",
                        "http://localhost:3000"
                ));
                cfg.setAllowedMethods(Collections.singletonList("*")); // cho phép truy cập từ mọi method, vd: GET, POST, PUT, DELETE
                cfg.setAllowCredentials(true); // cho phép truy cập từ client có chứa cookie, vd: truy cập từ trình duyệt
                cfg.setAllowedHeaders(Collections.singletonList("*")); // cho phép truy cập từ mọi header, vd: Content-Type, Authorization
                cfg.setExposedHeaders(Arrays.asList("Authorization")); // cho phép truy cập từ header Authorization, để truyền token từ server về client
                cfg.setMaxAge(3600L); // thời gian tối đa mà client có thể lưu trữ CORS configuration, cho đơn giản là 1 giờ (3600 giây), sau 1 giờ client sẽ phải gửi yêu cầu CORS mới
                return cfg;
            }
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // tạo ra một đối tượng BCryptPasswordEncoder để mã hóa mật khẩu người dùng
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(); // tạo ra một đối tượng RestTemplate để gửi yêu cầu HTTP đến server khác
    }
}
