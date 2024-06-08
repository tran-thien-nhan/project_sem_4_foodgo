package com.foodgo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtProvider {
    private SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes()); //tạo ra một key từ chuỗi bí mật để mã hóa và giải mã token của người dùng gửi lên server

    public String generateToken(Authentication auth) { // tạo ra token từ thông tin người dùng
        Collection<? extends GrantedAuthority>authorities = auth.getAuthorities(); //lấy danh sách authorities của người dùng
        String roles = populateAuthorities(authorities); //tạo ra chuỗi authorities từ danh sách authorities
        String jwt = Jwts.builder().setIssuedAt(new Date()) //tạo ra token từ thông tin người dùng, builder() tạo ra một đối tượng JwtBuilder, setIssuedAt() set thời gian tạo token
                .setExpiration(new Date(new Date().getTime() + 86400000)) //set thời gian hết hạn của token, 86400000 là 1 ngày
                .claim("email", auth.getName()) //set thông tin email vào token
                .claim("authorities", roles) //set thông tin authorities vào token
                .signWith(key) //set key để mã hóa token
                .compact(); //tạo ra token

        return jwt;
    }

    public String getEmailFromJwtToken(String jwt){
        jwt = jwt.substring(7); //loại bỏ chuỗi "Bearer " ở đầu token
        Claims claims = Jwts.parserBuilder() //tạo ra một đối tượng Claims từ token của người dùng gửi lên server
                .setSigningKey(key) //set key để giải mã token
                .build() //tạo ra đối tượng Jws
                .parseClaimsJws(jwt) //giải mã token
                .getBody(); //lấy thông tin trong token
        String email = String.valueOf(claims.get("email")); //lấy thông tin email từ token
        return email;
    }
    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();
        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }
}
