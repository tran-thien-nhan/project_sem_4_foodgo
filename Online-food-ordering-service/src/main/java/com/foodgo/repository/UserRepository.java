package com.foodgo.repository;

import com.foodgo.model.PROVIDER;
import com.foodgo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>{ // Tạo interface UserRepository kế thừa JpaRepository với kiểu dữ liệu User và kiểu dữ liệu của id là Long
    public User findByEmail(String username); // Tìm kiếm user theo email

    public List<User> findByEmailAndProvider(String email, PROVIDER provider);

    User findByResetPasswordToken(String token);
}
