package com.foodgo.service;

import com.foodgo.model.USER_ROLE;
import com.foodgo.model.User;
import com.foodgo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service //đánh dấu class này là service
public class CustomerUserDetailsService implements UserDetailsService {

    @Autowired //tự động tìm kiếm và inject UserRepository vào CustomerUserDetailsService để sử dụng
    private UserRepository userRepository; //khai báo biến userRepository để tương tác với database
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException { //loadUserByUsername nghĩa là load user theo username
        User user = userRepository.findByEmail(username); // tìm user theo email, nếu không tìm thấy thì trả về null
        if (user == null) { // nếu không tìm thấy user
            throw new UsernameNotFoundException("User not found with email " + username); // nếu không tìm thấy user thì trả về thông báo "User not found"
        }
        USER_ROLE role = user.getRole(); // lấy role của user

        List<GrantedAuthority> authorities = new ArrayList<>(); // tạo mảng authorities chứa thông tin về quyền của user

        authorities.add(new SimpleGrantedAuthority(role.toString())); // thêm quyền của user vào mảng authorities, role.toString() chuyển role từ kiểu enum sang kiểu string

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities); // trả về thông tin user, bao gồm email, password và authorities
    }
}
