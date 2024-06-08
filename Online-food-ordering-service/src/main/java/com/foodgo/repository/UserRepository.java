package com.foodgo.repository;

import com.foodgo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{ // Tạo interface UserRepository kế thừa JpaRepository với kiểu dữ liệu User và kiểu dữ liệu của id là Long
    public User findByEmail(String username); // Tìm kiếm user theo email

}
