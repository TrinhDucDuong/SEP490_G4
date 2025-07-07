package com.fourfingers.quangvinhstore.infrastructure.persistence.util;

import com.fourfingers.quangvinhstore.usecase.boundary.GenAiUtilBoundary;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GenAiUtil implements GenAiUtilBoundary {
    @Value("${genai.api.key}")
    private String apiKey;

    @Override
    public String callGenAi(String info, String question) {
        try (Client client = Client.builder()
                .apiKey(apiKey)
                .build()) {

            var config = GenerateContentConfig.builder()
                    .temperature(0.4f)
                    .topK(40.0f)
                    .topP(0.9f)
                    .maxOutputTokens(512)
                    .build();


            var content = Content.fromParts(
                    Part.fromText(
                            """
                            Bạn là một trợ lý AI thân thiện, lễ phép, luôn thể hiện sự tôn trọng và hỗ trợ tận tâm cho 
                            khách hàng.
                            Hãy trả lời câu hỏi một cách tự nhiên, lịch sự, nhẹ nhàng, dùng ngôn từ gần gũi như một nhân
                            viên chăm sóc khách hàng chuyên nghiệp.
                            Chỉ dựa vào thông tin được cung cấp dưới đây để trả lời.
                            Nếu không đủ thông tin, hãy lịch sự xin lỗi và khuyến khích khách hàng liên hệ trực tiếp để 
                            được hỗ trợ chi tiết hơn.
                            Sử dụng dấu - để liệt kê thông tin chi tiết các thông tin trong câu trả lời.
                            Định dạng số tiền và số ODO với dấu chấm (.) để dễ đọc (ví dụ: 1.000.000.000 VND, 10.000 VND).
                            Nếu liệt kê số sản phẩm thì không cần thông tin chi tiết, chỉ cần tên, phân loại và thương 
                            hiệu.
                            Khi nào yêu cầu thêm thông tin về sản phẩm cụ thể hãy liệt kê chi tiết từ sản phẩm đến các
                            biến thể bao gồm cả màu sắc
                            """
                    ),
                    Part.fromText("Thông tin: " + info),
                    Part.fromText("Câu hỏi: " + question)
            );

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-2.5-flash",
                            content,
                            config);

            return response.text();

        } catch (RuntimeException e) {
            return "Lỗi khi tạo/gọi Client: " + e.getMessage();
        }
    }

    @Override
    public String getRecommendation(String productInfo, String actionLogInfo) {
        try (Client client = Client.builder()
                .apiKey(apiKey)
                .build()) {

            var config = GenerateContentConfig.builder()
                    .temperature(0.3f)
                    .topK(30.0f)
                    .topP(0.9f)
                    .maxOutputTokens(4096)
                    .build();

            var content = Content.fromParts(
                    Part.fromText(
                            """
                            Bạn là hệ thống gợi ý sản phẩm thông minh.
                            Dựa vào thông tin log hành vi người dùng, hãy phân tích và đưa ra danh sách các `productId` 
                            mà người dùng có thể sẽ thích.
                            Dưới đâ là nội dung về hành vi người dùng theo các trình tự:
                            - performer id là id của người dùng
                            - reference id là id của sản phẩm hay biến thể sản phẩm mà người đó tương tác.
                            - reference type là loại của reference, ví dụ người đó xem thông tin chi tiết của 1 sản phẩm
                            hay thêm vào giỏ hàng 1 biến thể của sản phẩm.
                            Các tương tác được gửi cho bạn là 20 tương tác gần nhất của khách hàng.
                            Chỉ trả về danh sách các productId
                            Không cần giải thích thêm.
                            Nếu không thể phân tích hãy nói rõ lý do
                            """
                    ),
                    Part.fromText("Thông tin về sản phẩm trong cửa hàng: " + productInfo),
                    Part.fromText("Thông tin về các tương tác của người dùng: " + actionLogInfo)
            );

            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash",
                    content,
                    config
            );

            if (response != null && response.text() != null) {
                return response.text();
            } else {
                System.err.println("Gemini trả về response null hoặc text null");
                return "[]";
            }

        } catch (RuntimeException e) {
            e.printStackTrace(); // In ra stack trace
            System.err.println("Lỗi khi tạo/gọi Client: " + e.getMessage());
            return "[]";
        }
    }
}
