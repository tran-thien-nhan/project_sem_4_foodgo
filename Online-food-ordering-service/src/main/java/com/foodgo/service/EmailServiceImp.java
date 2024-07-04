package com.foodgo.service;

import com.foodgo.model.Mail;
import com.foodgo.repository.MailRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;

@Service
public class EmailServiceImp implements EmailService {

    @Autowired
    private MailRepository mailRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public void sendMailWelcomeOwner(String mail, String fullname) throws MessagingException, UnsupportedEncodingException {
        sendEmail(mail, "Welcome To FOOD GO", getOwnerWelcomeEmailContent(fullname));
        saveMailToDatabase(mail, "Welcome To FOOD GO", getOwnerWelcomeEmailContent(fullname));
    }

    @Override
    public void sendMailWelcomeCustomer(String mail, String fullname) throws MessagingException, UnsupportedEncodingException {
        sendEmail(mail, "Welcome To FOOD GO", getCustomerWelcomeEmailContent(fullname));
        saveMailToDatabase(mail, "Welcome To FOOD GO", getCustomerWelcomeEmailContent(fullname));
    }

    private void sendEmail(String mail, String subject, String content) throws MessagingException, UnsupportedEncodingException {
        if (mail == null || mail.isEmpty()) {
            throw new MessagingException("To address must not be null or empty");
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        helper.setFrom(new InternetAddress(sender, "FOOD GO"));
        helper.setTo(mail);
        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(mimeMessage);
    }

    private void saveMailToDatabase(String mail, String subject, String content) {
        try{
            Mail mailRecord = new Mail();
            mailRecord.setToMails(mail);
            mailRecord.setSubject(subject);
            mailRecord.setContent(content);
            mailRecord.setTimestamp(LocalDateTime.now());
            mailRepository.save(mailRecord);
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    private String getOwnerWelcomeEmailContent(String fullname) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Chào Mừng Gia Nhập Food Go - Chủ Nhà Hàng</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f4f4f4;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        .container {\n" +
                "            background-color: #fff;\n" +
                "            margin: 50px auto;\n" +
                "            padding: 20px;\n" +
                "            border-radius: 8px;\n" +
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                "            max-width: 600px;\n" +
                "        }\n" +
                "        .header {\n" +
                "            background-color: #4CAF50;\n" +
                "            color: white;\n" +
                "            padding: 10px 0;\n" +
                "            text-align: center;\n" +
                "            border-radius: 8px 8px 0 0;\n" +
                "        }\n" +
                "        .content {\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .content h1 {\n" +
                "            color: #333;\n" +
                "        }\n" +
                "        .content p {\n" +
                "            color: #555;\n" +
                "            line-height: 1.6;\n" +
                "        }\n" +
                "        .footer {\n" +
                "            text-align: center;\n" +
                "            padding: 10px;\n" +
                "            font-size: 12px;\n" +
                "            color: #777;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <h1>Chào Mừng Gia Nhập Food Go!</h1>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <h1>Xin chào " + fullname + ",</h1>\n" +
                "            <p>Chúng tôi rất vui mừng chào đón bạn đến với Food Go. Với tư cách là một chủ nhà hàng, bạn sẽ có cơ hội tiếp cận nhiều khách hàng hơn và quản lý nhà hàng của mình một cách hiệu quả hơn.</p>\n" +
                "            <p>Chúng tôi tin rằng Food Go sẽ là một nền tảng hữu ích để bạn phát triển kinh doanh và mang lại nhiều lợi ích cho nhà hàng của bạn. Nếu bạn có bất kỳ câu hỏi nào, xin đừng ngần ngại liên hệ với chúng tôi.</p>\n" +
                "            <p>Chúc bạn thành công và phát triển vượt bậc cùng Food Go!</p>\n" +
                "            <p>Trân trọng,<br/>Đội ngũ Food Go</p>\n" +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            © 2024 Food Go. All rights reserved.\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    private String getCustomerWelcomeEmailContent(String fullname) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Chào Mừng Gia Nhập Food Go - Khách Hàng</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f4f4f4;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        .container {\n" +
                "            background-color: #fff;\n" +
                "            margin: 50px auto;\n" +
                "            padding: 20px;\n" +
                "            border-radius: 8px;\n" +
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                "            max-width: 600px;\n" +
                "        }\n" +
                "        .header {\n" +
                "            background-color: #FF5733;\n" +
                "            color: white;\n" +
                "            padding: 10px 0;\n" +
                "            text-align: center;\n" +
                "            border-radius: 8px 8px 0 0;\n" +
                "        }\n" +
                "        .content {\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .content h1 {\n" +
                "            color: #333;\n" +
                "        }\n" +
                "        .content p {\n" +
                "            color: #555;\n" +
                "            line-height: 1.6;\n" +
                "        }\n" +
                "        .footer {\n" +
                "            text-align: center;\n" +
                "            padding: 10px;\n" +
                "            font-size: 12px;\n" +
                "            color: #777;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <h1>Chào Mừng Gia Nhập Food Go!</h1>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <h1>Xin chào " + fullname + ",</h1>\n" +
                "            <p>Chúng tôi rất vui mừng chào đón bạn đến với Food Go. Bạn sẽ có cơ hội khám phá và trải nghiệm nhiều nhà hàng ngon với dịch vụ tốt nhất.</p>\n" +
                "            <p>Chúng tôi tin rằng Food Go sẽ mang lại cho bạn những trải nghiệm ẩm thực tuyệt vời và tiện lợi. Nếu bạn có bất kỳ câu hỏi nào, xin đừng ngần ngại liên hệ với chúng tôi.</p>\n" +
                "            <p>Chúc bạn có những trải nghiệm ẩm thực thú vị cùng Food Go!</p>\n" +
                "            <p>Trân trọng,<br/>Đội ngũ Food Go</p>\n" +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            © 2024 Food Go. All rights reserved.\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }
}
