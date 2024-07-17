package com.foodgo.service;

import com.foodgo.model.ChangePasswordResult;
import com.foodgo.model.ChangePasswordToken;
import com.foodgo.model.User;
import com.foodgo.repository.ChangePasswordRepository;
import com.foodgo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public void sendChangePasswordToken(Long userId){
        String token = generateRandomNumbericToken();
        ChangePasswordToken changePasswordToken = new ChangePasswordToken();
        changePasswordToken.setToken(token);
        changePasswordToken.setUserId(userId);
        changePasswordToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(changePasswordToken);

        Optional<User> userOpt = userRepository.findById(userId);
        if(userOpt.isPresent()){
            User user = userOpt.get();
            sendEmail(user.getEmail(),token);
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

    @Transactional
    public ChangePasswordResult ChangingPassword(Long userId,String currentPassword,String newPassword,String confirmPassword,String token){
        if(!validateToken(userId,token)){
            return new ChangePasswordResult(false,"Invalid or expired token");
        }

        if(!newPassword.equals(confirmPassword)){
            return new ChangePasswordResult(false,"Passwords do not match.");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if(userOpt.isPresent()){
            User user = userOpt.get();
            if(!passwordEncoder.matches(currentPassword,user.getPassword())){
                return new ChangePasswordResult(false,"Password is incorrect.");
            }

            for(String previousPassword : user.getPreviousPassword()){
                if(passwordEncoder.matches(newPassword,previousPassword)){
                    return new ChangePasswordResult(false,"You already used this password before.");
                }
            }

            List<String> previousPassword = user.getPreviousPassword();
            if(previousPassword.size() == 5){
                previousPassword.remove(0);
            }
            previousPassword.add(user.getPassword());

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setPreviousPassword(previousPassword);
            userRepository.save(user);

            tokenRepository.deleteByUserId(userId);
            return new ChangePasswordResult(true,"Password changed successfully.");
        }
        return new ChangePasswordResult(false,"User not found.");
    }
}
