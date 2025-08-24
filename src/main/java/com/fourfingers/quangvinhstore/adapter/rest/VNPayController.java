package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Controller handling VNPay payment integration operations.
 * This class manages the creation and processing of VNPay payment requests.
 * Mapped to the "/vnpay" endpoint.
 *
 * @author DuongTDHE171824
 */
@Controller
@RequestMapping("/vnpay")
public class VNPayController {

    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${vnpay.hash-secret}")
    private String vnp_HashSecret;

    @Value("${vnpay.api-url}")
    private String vnp_PayUrl;

    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;

    /**
     * Generates a VNPay payment URL for a given order.
     *
     * @param orderOutputData            The order data containing payment details
     * @param customerOrderInputBoundary The boundary interface for customer order operations
     * @param request                    The HTTP request object containing client information
     * @return The generated VNPay payment URL
     * @throws UnsupportedEncodingException If encoding the URL parameters fails
     */
    public String showQRPage(
                                OrderOutputData orderOutputData,
                                CustomerOrderInputBoundary customerOrderInputBoundary,
                                HttpServletRequest request
                            ) throws UnsupportedEncodingException {
        String vnp_TxnRef = String.valueOf("#ORD" + System.currentTimeMillis());
        String vnp_OrderInfo = "Thanh toán đơn hàng Quang Vinh Authentic #DH" + orderOutputData.getOrder().getOrderId();
        String orderType = "other";

        BigDecimal total = orderOutputData.getOrder().getTotalPrice();
        String vnp_Amount = String.valueOf(total.multiply(BigDecimal.valueOf(100)).longValue());

        String vnp_Locale = "vn";
        String vnp_BankCode = "";
        String vnp_IpAddr = request.getRemoteAddr();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String value = vnp_Params.get(fieldName);
            if ((value != null) && (!value.isEmpty())) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8)).append('&');
                query.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8)).append('&');
            }
        }

        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        String secureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        // set secureHash to order
        customerOrderInputBoundary.setSecureHash(orderOutputData.getOrder().getOrderId(), vnp_TxnRef);

        String paymentUrl = vnp_PayUrl + "?" + query.toString();
        
        return paymentUrl;
    }

    /**
     * Generates HMAC-SHA512 hash for VNPay secure hash generation.
     *
     * @param key  The secret key for HMAC generation
     * @param data The data to be hashed
     * @return The generated HMAC-SHA512 hash as a hexadecimal string
     */
    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] hash = hmac512.doFinal(data.getBytes());
            return bytesToHex(hash);
        } catch (Exception ex) {
            throw new RuntimeException("Cannot generate HMAC", ex);
        }
    }

    /**
     * Converts a byte array to its hexadecimal string representation.
     *
     * @param bytes The byte array to convert
     * @return The hexadecimal string representation of the byte array
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}

