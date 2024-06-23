package com.foodgo.service;

import com.foodgo.model.Cart;
import com.foodgo.model.CartItem;
import com.foodgo.model.Order;
import com.foodgo.response.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImp implements PaymentService{

    @Value("${stripe.api.key}") // Lấy giá trị từ file application.properties
    private String stripeSecretKey;
    @Override
    public PaymentResponse createPaymentLink(Order order) throws StripeException {

        Stripe.apiKey = stripeSecretKey; // Set api key cho Stripe

        long totalAmountInCents = Math.round(order.getTotalPrice() * 100);

        SessionCreateParams params = SessionCreateParams // Tạo một session mới, session là một phiên làm việc giữa client và server
                .builder() // Sử dụng builder pattern
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD) // Chỉ chấp nhận thanh toán bằng thẻ, còn addAllPaymentMethodTypes thì chấp nhận tất cả các phương thức thanh toán
                .setMode(SessionCreateParams.Mode.PAYMENT) // PAYMENT là chế độ thanh toán một lần, SETUP là chế độ thanh toán định kỳ
                .setSuccessUrl("http://localhost:3000/payment/success") // Đường dẫn khi thanh toán thành công
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

        PaymentResponse res = new PaymentResponse(); // Tạo một payment response mới
        res.setPayment_url(session.getUrl()); // Set url cho payment response


        return res; // Trả về payment response
    }
}
