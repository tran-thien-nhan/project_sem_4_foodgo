package com.foodgo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

public class JwtTokenValidator extends OncePerRequestFilter {

    //kiểm tra token của người dùng gửi lên server có hợp lệ không
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String jwt = request.getHeader(JwtConstant.JWT_HEADER); //lấy token từ header của request gửi lên server

        //Bearer token
        if (jwt != null) { //kiểm tra token
            jwt = jwt.substring(7); //loại bỏ chuỗi "Bearer " ở đầu token
            try {
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes()); //tạo ra một key từ chuỗi bí mật để mã hóa và giải mã token của người dùng gửi lên server
                Claims claims = Jwts.parserBuilder() //tạo ra một đối tượng Claims từ token của người dùng gửi lên server
                        .setSigningKey(key) //set key để giải mã token
                        .build() //tạo ra đối tượng Jws
                        .parseClaimsJws(jwt) //giải mã token
                        .getBody(); //lấy thông tin trong token

                String email = String.valueOf(claims.get("email")); //lấy thông tin email từ token
                String authorities = String.valueOf(claims.get("authorities")); //lấy thông tin authorities từ token

                //ROLE_CUSTOMER, ROLE_ADMIN

                List<GrantedAuthority> auth = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities); //tạo ra một danh sách authorities từ chuỗi authorities, authorities ở đay là role của người dùng
                Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auth); //tạo ra một đối tượng Authentication từ email và authorities của người dùng,
                SecurityContextHolder.getContext().setAuthentication(authentication); //set Authentication vào SecurityContextHolder để xác thực người dùng
            }
            catch (Exception e){
                throw new BadCredentialsException("Please log in or sign up!"); //nếu token không hợp lệ, ném ra lỗi
            }
        }
        filterChain.doFilter(request, response); //chuyển request và response cho filter tiếp theo, nếu không có lỗi
    }
}
