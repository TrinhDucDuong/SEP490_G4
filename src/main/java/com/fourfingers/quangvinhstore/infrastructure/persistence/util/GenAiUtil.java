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
                    .temperature(0.0f) //hoàn thoàn không sáng tạo
                    .topK(1.0f) //Chọn 1 từ có xác xuất cao nhất tại mỗi bước
                    .topP(1.0f) //
                    .maxOutputTokens(512)
                    .build();


            var content = Content.fromParts(
                    Part.fromText("Bạn là một AI. Chỉ trả lời dựa vào thông tin sau. " +
                            "Nếu không có đủ thông tin, hãy trả lời 'Vấn đề này tôi hiện không biết trả lời, quý khách" +
                            "vui lòng liên hệ theo phương thức khác để được nhân viên tư vấn'."),
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
}
