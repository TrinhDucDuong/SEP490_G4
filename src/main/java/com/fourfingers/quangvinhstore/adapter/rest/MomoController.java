package com.fourfingers.quangvinhstore.adapter.rest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payment2")
public class MomoController {

    @Value("${momo.access-key}")
    private String accessKey;

    @Value("${momo.secret-key}")
    private String secretKey;

    @Value("${momo.endpoint}")
    private String endpoint;

    @Value("${momo.partner-code}")
    private String partnerCode;

    private static final Map<String, String> paymentStatusStore = new HashMap<>();
    @GetMapping
    public ResponseEntity<Void> createMomoPayment(@RequestParam Integer amount) throws Exception {
        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();
        String redirectUrl = "http://localhost:8081/payment/momo-return?orderId=" + orderId;
        String ipnUrl = "http://localhost:8081/payment/momo-ipn";
        String orderInfo = "Test momo";
//        String amount = "21062025";
        String requestType = "captureWallet";
        String extraData = "";

        String rawSignature = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = hmacSHA256(secretKey, rawSignature);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("partnerCode", partnerCode);
        body.put("accessKey", accessKey);
        body.put("requestId", requestId);
        body.put("amount", amount);
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", redirectUrl);
        body.put("ipnUrl", ipnUrl);
        body.put("lang", "vi");
        body.put("extraData", extraData);
        body.put("requestType", requestType);
        body.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, request, Map.class);
        String payUrl = (String) response.getBody().get("payUrl");

        paymentStatusStore.put(orderId, "PENDING");

        return ResponseEntity.status(302).header("Location", payUrl).build();
    }

    @PostMapping("/momo-ipn")
    public ResponseEntity<String> handleMomoIpn(@RequestBody Map<String, Object> data) {
        String orderId = (String) data.get("orderId");
        String resultCode = String.valueOf(data.get("resultCode")); // 0 = success

        if ("0".equals(resultCode)) {
            paymentStatusStore.put(orderId, "SUCCESS");
            System.out.println("Thanh toán thành công cho đơn " + orderId);
        } else {
            paymentStatusStore.put(orderId, "FAILED");
            System.out.println("Thanh toán thất bại cho đơn " + orderId);
        }

        return ResponseEntity.ok("IPN RECEIVED");
    }


    @GetMapping("/momo-return")
    public String handleMomoReturn(@RequestParam String orderId) {
        String status = paymentStatusStore.getOrDefault(orderId, "UNKNOWN");

        return switch (status) {
            case "SUCCESS" -> "Thanh toán thành công đơn hàng " + orderId;
            case "FAILED" -> "Thanh toán thất bại đơn hàng " + orderId;
            case "PENDING" -> "Đang xử lý thanh toán đơn hàng " + orderId;
            default -> "Không tìm thấy đơn hàng.";
        };
    }

    private String hmacSHA256(String key, String data) throws Exception {
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSha256.init(secretKeySpec);
        byte[] hash = hmacSha256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}

