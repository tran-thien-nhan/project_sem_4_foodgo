package com.foodgo.service;

import com.foodgo.model.Event;
import com.foodgo.model.Mail;
import com.foodgo.repository.EventRepository;
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
import java.util.List;

@Service
public class EmailServiceImp implements EmailService {

    @Autowired
    private MailRepository mailRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EventRepository eventRepository;

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
                "    <title>Welcome To FoodGo - Restaurant Owner</title>\n" +
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
                "            <h1>Welcome To FoodGo!</h1>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <h1>Hi " + fullname + ",</h1>\n" +
                "       <p>We are very excited to welcome you to Food Go. As a restaurant owner, you will have the opportunity to reach more customers and manage your restaurant more efficiently.</p>\n" +
                "       <p>We believe that Food Go will be a useful platform for you to grow your business and bring many benefits to your restaurant. If you have any questions, please do not hesitate to contact us.</p>\n" +
                "       <p>We wish you success and significant growth with Food Go!</p>\n"+
                "       <p>Sincerely,<br/>The Food Go Team</p>\n"+
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
                "            <h1>Welcome To FoodGo!</h1>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <h1>Hi " + fullname + ",</h1>\n" +
                "            <p>We are very excited to welcome you to Food Go. You will have the opportunity to explore and experience many delicious restaurants with the best service.</p>\n" +
                "            <p>We believe that Food Go will bring you wonderful and convenient culinary experiences. If you have any questions, please do not hesitate to contact us.</p>\n" +
                "            <p>We wish you enjoyable dining experiences with Food Go!</p>\n" +
                "            <p>Sincerely,<br/>The Food Go Team</p>\n" +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            © 2024 Food Go. All rights reserved.\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    public void sendPasswordResetEmail(String email, String token) throws MessagingException, UnsupportedEncodingException {
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        String content = "<p>Hello,</p>"
                + "<p>You have requested to reset your password.</p>"
                + "<p>Click the link below to reset your password:</p>"
                + "<p><a href=\"" + resetUrl + "\">Reset Password</a></p>"
                + "<p>Ignore this email if you do remember your password, "
                + "or you have not made the request.</p>";
        sendEmail(email, "Password Reset Request", content);
    }

    @Override
    public void sendOtpEmail(String email, String otp) throws MessagingException, UnsupportedEncodingException {
        String subject = "Your OTP Code";
        String content = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px;\">" +
                "<h2 style=\"color: #333;\">FOOD GO</h2>" +
                "<p>Dear Customer,</p>" +
                "<p>Thank you for using our service. Your OTP code is:</p>" +
                "<p style=\"font-size: 24px; font-weight: bold; color: #ff6f61;\">" + otp + "</p>" +
                "<p>Please do not share this code with anyone. It will expire in 10 minutes.</p>" +
                "<p>Best regards,</p>" +
                "<p><strong>FOOD GO Team</strong></p>" +
                "<hr style=\"border: 0; border-top: 1px solid #dcdcdc;\">" +
                "<p style=\"font-size: 12px; color: #777;\">If you did not request this code, please ignore this email.</p>" +
                "</div>";

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        helper.setFrom(new InternetAddress(sender, "FOOD GO"));
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(mimeMessage);
    }

    @Override
    public void sendMailEvent(List<String> emails , Event event) throws MessagingException, UnsupportedEncodingException {
        String subject = "New Event: " + event.getName();
        String content = "<div style=\"border: 1px solid #dcdcdc; border-radius: 10px; padding: 20px; font-family: Arial, sans-serif;\">"
                + "<div style=\"text-align: center;\">"
                + "<img src=\"" + event.getImages().get(0) + "\" alt=\"Event Image\" style=\"width: 100%; max-width: 600px; border-radius: 10px;\"/>"
                + "</div>"
                + "<div style=\" text-align: center; \">"
                + "<h2 style=\"color: #333;\">New Event: " + event.getName() + "</h2>"
                + "<p style=\"font-size: 16px; color: #555;\">We are excited to announce a new event:</p>"
                + "<p><strong>Event Name:</strong> " + event.getName() + "</p>"
                + "<p><strong>Location:</strong> " + event.getLocation() + "</p>"
                + "<p><strong>Description:</strong> " + event.getDescription() + "</p>"
                + "<p><strong>Starts At:</strong> " + event.getStartedAt() + "</p>"
                + "<p><strong>Ends At:</strong> " + event.getEndsAt() + "</p>"
                + "<p>Don't miss it!</p>"
                + "</div>";
        for (String email : emails) {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(new InternetAddress(sender, "FOOD GO"));
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(mimeMessage);

            event.setEmailSentNewEvent(true);
            eventRepository.save(event);
            //save database
            saveMailToDatabase(email, subject, content);
        }
    }

    @Override
    public void sendMailEventFull(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException {
        String subject = "Event Full: " + event.getName();
        String content = "<div style=\"border: 1px solid #dcdcdc; border-radius: 10px; padding: 20px; font-family: Arial, sans-serif;\">"
                + "<h2 style=\"color: #333;\">Event Full: " + event.getName() + "</h2>"
                + "<p style=\"font-size: 16px; color: #555;\">We would like to inform you that the event:</p>"
                + "<p><strong>Event Name:</strong> " + event.getName() + "</p>"
                + "<p>is now full.</p>"
                + "<p>Thank you for your interest!</p>"
                + "</div>";

        for (String email : emails) {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(new InternetAddress(sender, "FOOD GO"));
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(mimeMessage);

            event.setEmailSentEventFull(true);
            eventRepository.save(event);
            //save database
            saveMailToDatabase(email, subject, content);
        }

    }

    @Override
    public void sendMailEventExpired(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException {
        String subject = "Event Expired: " + event.getName();
        String content = "<div style=\"border: 1px solid #dcdcdc; border-radius: 10px; padding: 20px; font-family: Arial, sans-serif;\">"
                + "<h2 style=\"color: #333;\">Event Expired: " + event.getName() + "</h2>"
                + "<p style=\"font-size: 16px; color: #555;\">We would like to inform you that the event:</p>"
                + "<p><strong>Event Name:</strong> " + event.getName() + "</p>"
                + "<p>has expired.</p>"
                + "<p>Thank you for your participation!</p>"
                + "</div>";

        for (String email : emails) {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(new InternetAddress(sender, "FOOD GO"));
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(mimeMessage);

            event.setEmailSentEventExpired(true);
            eventRepository.save(event);
            //save database
            saveMailToDatabase(email, subject, content);
        }
    }

    @Override
    public void sendMailEventCanceled(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException {
        String subject = "Event Canceled: " + event.getName();
        String content =
                "<div style=\"border: 1px solid #dcdcdc; border-radius: 10px; padding: 20px; font-family: Arial, sans-serif;\">"
                + "<img src=\"" + event.getImages().get(0) + "\" alt=\"Event Image\" style=\"width: 100%; max-width: 600px; border-radius: 10px;\"/>"
                + "<h2 style=\"color: #333;\">Event Cancelled: " + event.getName() + "</h2>"
                + "<p style=\"font-size: 16px; color: #555;\">We regret to inform you that the event:</p>"
                + "<p><strong>Event Name:</strong> " + event.getName() + "</p>"
                + "<p>has been canceled.</p>"
                + "<p>We apologize for any inconvenience caused.</p>"
                + "</div>";
        for (String email : emails) {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(new InternetAddress(sender, "FOOD GO"));
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(mimeMessage);


            //save database
            //saveMailToDatabase(email, subject, content);
        }
    }

    @Override
    public void sendMailEventStarted(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException {
        String subject = "Event Started: " + event.getName();
        String content = "<div style=\"border: 1px solid #dcdcdc; border-radius: 10px; padding: 20px; font-family: Arial, sans-serif;\">"
                + "<h2 style=\"color: #333;\">Event Started: " + event.getName() + "</h2>"
                + "<p style=\"font-size: 16px; color: #555;\">We are pleased to announce that the event:</p>"
                + "<p><strong>Event Name:</strong> " + event.getName() + "</p>"
                + "<p>has started.</p>"
                + "<p>We hope you enjoy the event!</p>"
                + "</div>";
        for (String email : emails) {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(new InternetAddress(sender, "FOOD GO"));
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(mimeMessage);

            event.setEmailSentEventStarted(true);
            eventRepository.save(event);

            //save database
            saveMailToDatabase(email, subject, content);
        }
    }



}
