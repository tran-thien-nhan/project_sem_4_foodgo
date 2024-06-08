package com.foodgo.config;

public class JwtConstant {
    public static final String SECRET_KEY = "wcervevewrvetrvcehgergrntfjmuholuiersver"; // chuỗi bí mật để mã hóa và giải mã token
    public static final String JWT_HEADER="Authorization"; // mục đích để lấy token từ header của request gửi lên server để xác thực người dùng
}
