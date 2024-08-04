package com.foodgo.service;

import com.foodgo.model.PROVIDER;
import com.foodgo.model.TwoFactorCode;
import com.foodgo.model.User;
import com.foodgo.repository.TwoFactorCodeRepository;
import com.foodgo.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TwoFactorAuthServiceImp implements TwoFactorAuthService{
    @Autowired
    private TwoFactorCodeRepository twoFactorCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;
    private static final int CODE_LENGTH = 6;
    @Override
    public String generateCode() { // Tạo mã xác thực
        SecureRandom random = new SecureRandom(); // Tạo một số ngẫu nhiên
        StringBuilder code = new StringBuilder(CODE_LENGTH); // Tạo một StringBuilder với độ dài CODE_LENGTH
        for (int i = 0; i < CODE_LENGTH; i++) { // Vòng lặp từ 0 đến CODE_LENGTH
            code.append(random.nextInt(10)); // Thêm một số ngẫu nhiên từ 0 đến 9 vào code
        }
        return code.toString(); // Trả về code dưới dạng chuỗi
    }

    @Override
    public boolean verifyCode(String inputCode, String email) throws MessagingException, UnsupportedEncodingException {
        List<User> users = userRepository.findByEmailAndProvider(email, PROVIDER.NORMAL); // Tìm kiếm user theo email và provider
        if (users.size() == 0) { // Nếu không tìm thấy user
            return false;
        }
        User user = users.get(0); // Lấy user đầu tiên
        List<TwoFactorCode> twoFactorCodes = user.getTwoFaCodes(); // Lấy danh sách mã xác thực của user

        for (TwoFactorCode code : twoFactorCodes) { // Duyệt qua từng mã xác thực
            List<String> codes = code.getCodes(); // Lấy danh sách mã xác thực
            if (codes.contains(inputCode)) { // Nếu mã xác thực đúng
                codes.remove(inputCode); // Xoá mã xác thực
                if (codes.isEmpty()) { // Nếu không còn mã nào
                    // Xoá mã xác thực và tạo mới 10 mã mới
                    twoFactorCodeRepository.delete(code);

                    List<String> newCodes = generateNewCodes(10); // Tạo mới 10 mã
                    TwoFactorCode newTwoFactorCode = new TwoFactorCode();
                    newTwoFactorCode.setUser(user);
                    newTwoFactorCode.setCodes(newCodes);
                    twoFactorCodeRepository.save(newTwoFactorCode); // Lưu mã mới vào cơ sở dữ liệu

                    // Gửi email với danh sách mã mới
                    emailService.send2FaCodes(email, newCodes);

                } else {
                    twoFactorCodeRepository.save(code); // Cập nhật mã còn lại
                }
                return true;
            }
        }

        return false;
    }


    @Override
    public List<String> generateNewCodes(int count) {
        List<String> codes = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            codes.add(generateCode());
        }
        return codes;
    }

    @Override
    public void generateAndSaveNewCodes(String email, int count) {
        List<String> codes = generateNewCodes(count);
        List<User> optionalUser = userRepository.findByEmailAndProvider(email, PROVIDER.NORMAL);
        if (optionalUser.size() == 0) {
            return;
        }
        User user = optionalUser.get(0);
        TwoFactorCode twoFactorCode = new TwoFactorCode();
        twoFactorCode.setUser(user);
        twoFactorCode.setCodes(codes);
        twoFactorCodeRepository.save(twoFactorCode);
    }
}
