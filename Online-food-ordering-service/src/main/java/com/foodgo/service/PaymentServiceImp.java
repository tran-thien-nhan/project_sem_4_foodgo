package com.foodgo.service;

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
    public String refundPayment(String paymentIntentId) throws StripeException { // Hàm refund một payment, paymentIntentId la id cua paymentIntent, paymentIntent la mot doi tuong dai dien cho mot thanh toan
        Stripe.apiKey = stripeSecretKey; // Set api key cho Stripe

        RefundCreateParams params = RefundCreateParams // Tạo một refund mới
                .builder() // Sử dụng builder pattern
                .setPaymentIntent(paymentIntentId) // Set payment intent id
                .build(); // Build refund

        Refund refund = Refund.create(params); // Tạo refund mới

        return refund.getStatus();  // Trả về trạng thái của refund
    }

}
