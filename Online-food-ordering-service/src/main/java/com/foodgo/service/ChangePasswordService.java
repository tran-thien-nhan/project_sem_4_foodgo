package com.foodgo.service;

import com.foodgo.model.ChangePasswordResult;
import com.foodgo.model.ChangePasswordToken;
import com.foodgo.model.User;
import com.foodgo.repository.ChangePasswordRepository;
import com.foodgo.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class ChangePasswordService {

    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChangePasswordRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public void sendChangePasswordToken(Long userId) throws MessagingException, UnsupportedEncodingException {
        String token = generateRandomNumbericToken();
        ChangePasswordToken changePasswordToken = new ChangePasswordToken();
        changePasswordToken.setToken(token);
        changePasswordToken.setUserId(userId);
        changePasswordToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(changePasswordToken);

        Optional<User> userOpt = userRepository.findById(userId);
        if(userOpt.isPresent()){
            User user = userOpt.get();
//            sendEmail(user.getEmail(),token);
            emailService.sendPasswordChangeEmailOtp(user.getEmail(), token);
        }
    }

    private String generateRandomNumbericToken(){
        Random random = new Random();
        int randomInt = random.nextInt(900000) + 100000;
        return String.valueOf(randomInt);
    }

    private void sendEmail(String to, String token){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("FOOD GO <" + from + ">");
        message.setTo(to);
        message.setSubject("Password Change Token");
        message.setText("Your token to change password is:  " + token);
        mailSender.send(message);
    }

    public boolean validateToken(Long userId, String token){
        Optional<ChangePasswordToken> tokenOpt = tokenRepository.findByUserIdAndToken(userId,token);
        return tokenOpt.isPresent() && tokenOpt.get().getExpiryDate().isAfter(LocalDateTime.now());
    }

    @Transactional // Đảm bảo rằng tất cả các thao tác trong phương thức này sẽ được thực hiện trong một giao dịch
    public ChangePasswordResult ChangingPassword(Long userId,String currentPassword,String newPassword,String confirmPassword,String token){
        ChangePasswordResult result = new ChangePasswordResult();
        Optional<ChangePasswordToken> changePasswordTokenOpt = tokenRepository.findByUserIdAndToken(userId, token);
        if (changePasswordTokenOpt.isEmpty()) {
            result.setSuccess(false);
            result.setMessage("Mã thay đổi mật khẩu không hợp lệ");
            return result;
        }

        ChangePasswordToken changePasswordToken = changePasswordTokenOpt.get();
        if (changePasswordToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            result.setSuccess(false);
            result.setMessage("Mã thay đổi mật khẩu đã hết hạn");
            return result;
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        // Kiểm tra nếu mật khẩu mới đã được sử dụng trong 5 lần gần nhất
        int passwordCheckLimit = 5;
        int checkStartIndex = Math.max(0, user.getPreviousPasswords().size() - passwordCheckLimit);
        List<String> recentPasswords = user.getPreviousPasswords().subList(checkStartIndex, user.getPreviousPasswords().size());
        for (String previousPassword : recentPasswords) {
            if (passwordEncoder.matches(newPassword, previousPassword)) {
                result.setSuccess(false);
                result.setMessage("Bạn đã sử dụng mật khẩu này trước đây");
                return result;
            }
        }

        // Lưu mật khẩu hiện tại vào danh sách các mật khẩu trước đó
        user.getPreviousPasswords().add(user.getPassword());

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(changePasswordToken);

        result.setSuccess(true);
        result.setMessage("Mật khẩu đã được thay đổi thành công");
        return result;
    }
}
