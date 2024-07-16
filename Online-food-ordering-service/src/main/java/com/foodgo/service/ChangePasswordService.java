package com.foodgo.service;

import com.foodgo.model.ChangePasswordToken;
import com.foodgo.model.User;
import com.foodgo.repository.ChangePasswordRepository;
import com.foodgo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    public boolean validateToken(String token){
        Optional<ChangePasswordToken> tokenOpt = tokenRepository.findByToken(token);
        return tokenOpt.isPresent() && tokenOpt.get().getExpiryDate().isAfter(LocalDateTime.now());
    }

    public boolean ChangePassword(Long userId,String currentPassword,String newPassword,String confirmPassword,String token){
        if(!validateToken(token)){
            return false;
        }

        if(!newPassword.equals(confirmPassword)){
            return false;
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if(userOpt.isPresent()){
            User user = userOpt.get();
            if(!user.getPassword().equals(currentPassword)){
                return false;
            }

            if(user.getPreviousPassword().contains(newPassword)) {
                return false;
            }
            List<String> previousPassword = user.getPreviousPassword();
            if(previousPassword.size() == 5){
                previousPassword.remove(0);
            }
            previousPassword.add(user.getPassword());

            user.setPassword(newPassword);
            userRepository.save(user);

            tokenRepository.deleteByUserId(userId);
            return true;
        }
        return false;
    }
}
