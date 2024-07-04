package com.foodgo.service;

import com.foodgo.config.VNPayConfig;
import com.foodgo.helper.OrderTemp;
import com.foodgo.model.Cart;
import com.foodgo.model.CartItem;
import com.foodgo.model.Order;
import com.foodgo.model.User;
import com.foodgo.repository.OrderRepository;
import com.foodgo.response.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.param.RefundCreateParams;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentServiceImp implements PaymentService{

    @Value("${stripe.api.key}") // Lấy giá trị từ file application.properties
    private String stripeSecretKey;

    @Autowired
    private UserService userService;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private VNPayConfig vnPayConfig;

    @Override
    public PaymentResponse createPaymentLink(Order order) throws StripeException {

        Stripe.apiKey = stripeSecretKey; // Set api key cho Stripe

        long totalAmountInCents = Math.round(order.getTotalPrice() * 100);
        totalAmountInCents += 18000; // Phí ship

        SessionCreateParams params = SessionCreateParams // Tạo một session mới, session là một phiên làm việc giữa client và server
                .builder() // Sử dụng builder pattern
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD) // Chỉ chấp nhận thanh toán bằng thẻ, còn addAllPaymentMethodTypes thì chấp nhận tất cả các phương thức thanh toán
                .setMode(SessionCreateParams.Mode.PAYMENT) // PAYMENT là chế độ thanh toán một lần, SETUP là chế độ thanh toán định kỳ
                .setSuccessUrl("http://localhost:3000/payment/success/" + order.getId()) // Đường dẫn khi thanh toán thành công
                .setCancelUrl("http://localhost:3000/payment/fail") // Đường dẫn khi hủy thanh toán
                .addLineItem( // Thêm một line item vào session
                        SessionCreateParams.LineItem.builder() // Sử dụng builder pattern
                                .setQuantity(1L) // Số lượng
                                .setPriceData( // Thông tin giá
                                        SessionCreateParams.LineItem.PriceData.builder() // Sử dụng builder pattern
                                                .setCurrency("usd") // Loại tiền tệ
                                                .setUnitAmount( totalAmountInCents ) // Số tiền
                                                .setProductData( // Thông tin sản phẩm
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder() // Sử dụng builder pattern
                                                                .setName("Food Go") // Tên sản phẩm
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params); // Tạo session mới

        // Lưu paymentIntentId vào Order
        order.setPaymentIntentId(session.getPaymentIntent());
        orderRepository.save(order); // Lưu order sau khi cập nhật paymentIntentId

        PaymentResponse res = new PaymentResponse(); // Tạo một payment response mới
        res.setPayment_url(session.getUrl()); // Set url cho payment response

        return res; // Trả về payment response
    }

    @Override
    public PaymentResponse createPaymentUrlVnPay(Order order) throws UnsupportedEncodingException {
        String vnp_Version = vnPayConfig.getVn_Version();
        String vnp_Command = vnPayConfig.getVn_Command();
        String vnp_TmnCode = vnPayConfig.getVn_TmnCode();
        String vnp_Amount = String.valueOf(order.getTotalPrice() * 100);
        String vnp_TxnRef = String.valueOf(order.getId());
        String vnp_OrderInfo = URLEncoder.encode("Order: " + order.getId(), StandardCharsets.US_ASCII.toString());
        String vnp_Locale = "vn";
        //String vnp_ReturnUrl = URLEncoder.encode("http://localhost:3000/payment/success/" + order.getId(), StandardCharsets.US_ASCII.toString());
        String vnp_ReturnUrl = "http://localhost:3000/payment/success/" + order.getId();
        String vnp_IpAddr = "127.0.0.1";
        String vnp_CurrCode = "VND";
        String vnp_OrderType = "other";

        // Get current date in yyyyMMddHHmmss format
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512(vnPayConfig.getVn_HashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVn_PayUrl() + "?" + queryUrl;

        PaymentResponse res = new PaymentResponse();
        res.setPayment_url(paymentUrl);

        System.out.println("Payment URL: " + paymentUrl);

        return res;
    }


    private String hmacSHA512(String secretKey, String data) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            for (byte b : hmacBytes) {
                result.append(String.format("%02x", b));
            }
            return result.toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to calculate HMAC-SHA-512", e);
        }
    }

    @Override
    public String refundPayment(String paymentIntentId) throws StripeException { // Hàm refund một payment, paymentIntentId la id cua paymentIntent, paymentIntent la mot doi tuong dai dien cho mot thanh toan
        Stripe.apiKey = stripeSecretKey; // Set api key cho Stripe

        RefundCreateParams params = RefundCreateParams // Tạo một refund mới
                .builder() // Sử dụng builder pattern
                .setPaymentIntent(paymentIntentId) // Set payment intent id
                .build(); // Build refund

        Refund refund = Refund.create(params); // Tạo refund mới

        return refund.getStatus();  // Trả về trạng thái của refund
    }

    @Override
    public boolean validateResponse(Map<String, String> vnp_Params) {
        String vnp_SecureHash = vnp_Params.get("vnp_SecureHash");
        vnp_Params.remove("vnp_SecureHash");
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(fieldValue);
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }
        String secureHash = hmacSHA512(vnPayConfig.getVn_HashSecret(), hashData.toString());
        return secureHash.equals(vnp_SecureHash);
    }

}
