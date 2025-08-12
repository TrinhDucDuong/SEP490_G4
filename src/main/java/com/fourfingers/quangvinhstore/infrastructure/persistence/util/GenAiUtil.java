package com.fourfingers.quangvinhstore.infrastructure.persistence.util;

import com.fourfingers.quangvinhstore.usecase.boundary.GenAiUtilBoundary;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
                    .maxOutputTokens(20000)
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
                            Liệt kê nên dùng cách gạch đầu dòng để tách biệt.
                            Ví dụ: "- Sản phẩm:
                                        - Phân loại
                                        - Thương hiệu
                                        - Các loại:
                                            - Màu đỏ, Size L: 30 cái...."
                            Xuống dòng sau mỗi phân loại
                            Bỏ hết ** cho việc in đậm, thay việc in đậm bằng việc bọc chữ cần in đậm
                            nằm trong thẻ <i> của HTML
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
                    .maxOutputTokens(20000)
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
                System.err.println("response: " + response.toString());
                return "[]";
            }

        } catch (RuntimeException e) {
            e.printStackTrace(); // In ra stack trace
            System.err.println("Lỗi khi tạo/gọi Client: " + e.getMessage());
            return "[]";
        }
    }

    @Override
    public String getAnswerAiAssistant(String info, String question) {
        try(Client client = Client.builder()
                .apiKey(apiKey)
                .build()) {
            var config = GenerateContentConfig.builder()
                    .temperature(0.4f)
                    .topK(40.0f)
                    .topP(0.9f)
                    .maxOutputTokens(20000)
                    .build();
            var content = Content.fromParts(
                    Part.fromText(
                            """
                            Bạn là một trợ lý AI lễ phép, lịch sự, bạn được đặt tên là Long Đẹp Trai
                            Người bạn đang báo cáo là chủ cửa hàng, không phải khách hàng
                            Chỉ trả lời thẳng vào câu hỏi. Ví dụ: Tổng lượng đơn hàng tháng trước, nếu dữ liệu cho bạn là
                            0 thì chỉ báo cáo là không có đơn, không lan man dài dòng
                            Dựa vào thông tin chính xác tôi cung cấp cho bạn, không tự ý thay đổi số liệu.
                            Chỉ trả lời sao cho lễ phép.
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
    public String getAnswerAboutReportInformation(String question) {
        try(Client client = Client.builder()
                .apiKey(apiKey)
                .build()) {
            var config = GenerateContentConfig.builder()
                    .temperature(0.0f)
                    .topK(1.0f)
                    .topP(1.0f)
                    .maxOutputTokens(20000)
                    .build();

            String promptTemplate = """
                    Bạn hãy dựa vào nội dung tôi cung cấp dưới đây để đưa ra các thông tin tôi cần theo format
                    Không tự thay đổi thông tin được cung cấp, chỉ chỉnh sửa cho đúng với format đầu ra.
                    Trả về thông tin duy nhất là text ứng với format đầu ra
                    Format đầu ra: "text1 text2 text3"
                    Trong đó:
                        - text1: Là nội dung liên quan: trả về order hoặc revenue dựa vào thông tin được\s
                        cung cấp trong câu hỏi.
                        - text2: Là ngày bắt đầu theo format "yyyy-mm-DDThh:mm:ss"
                        - text3: Là ngày kết thúc theo format "yyyy-mm-DDThh:mm:ss"
                    Các trường hợp có thể xảy ra liên quan đến text về ngày:\s
                        - 5 2 0 2 5 tức là năm 2025, tương tự với các năm khác bạn hãy suy luận ra năm
                        - tháng sáu là tháng 6
                        - ngày từ 1 tới 10 có trong thông tin đưa vào là Mùng 1, mùng 2 ... nên hãy trả về 01\s
                        hoặc 02.
                        - 2 0 2 0 5 tức là năm 2025, tương tự với các năm khác hãy suy luận
                        - giữa thông tin về ngày tháng năm hoàn toàn có thể bị chèn thêm 1 vài ký tự như ", ? ..."
                        hãy lọc bỏ và phân tích ngày tháng
                        - trong trường hợp thông tin đưa vào không có thông tin cụ thể mà chỉ hỏi hôm qua, hôm\s
                        nay hoặc tháng này, tháng trước:
                            + **Tháng này**: trả về ngày bắt đầu là ngày đầu tiên của tháng hiện tại và ngày kết thúc là thời gian hiện tại theo giờ Việt Nam. Thời gian hiện tại là {{current_datetime}}.
                            + **Tháng trước**: trả về ngày bắt đầu là ngày đầu tiên của tháng trước và ngày kết thúc là ngày cuối cùng của tháng trước. Thời gian hiện tại là {{current_datetime}}.
                            + **Tuần này**: trả về ngày bắt đầu là ngày đầu tiên của tuần hiện tại (Thứ Hai) và ngày kết thúc là thời gian hiện tại theo giờ Việt Nam. Thời gian hiện tại là {{current_datetime}}.
                            + **Tuần trước**: trả về ngày bắt đầu là ngày đầu tiên của tuần trước (Thứ Hai) và ngày kết thúc là ngày cuối cùng của tuần trước (Chủ Nhật). Thời gian hiện tại là {{current_datetime}}.
                            + **Hôm nay**: trả về ngày bắt đầu là 00:00:00 và ngày kết thúc là thời gian hiện tại theo giờ Việt Nam. Thời gian hiện tại là {{current_datetime}}.
                            + **Hôm qua**: trả về ngày bắt đầu là 00:00:00 của ngày hôm trước và ngày kết thúc là 23:59:59 của ngày hôm trước. Thời gian hiện tại là {{current_datetime}}.
                    Lưu ý:\s
                        - Luôn dùng giờ Việt Nam
                        - Chỉ trả về theo format "text1 text2 text3".
                        - Không thêm bất kỳ từ, ký tự nào khác ngoài 3 thành phần này, cách nhau đúng 1 dấu cách.
                    """;

            LocalDateTime currentDateTime = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            String formattedDateTime = currentDateTime.format(formatter);

            String finalPrompt = promptTemplate.replace("{{current_datetime}}", formattedDateTime);

            var content = Content.fromParts(
                    Part.fromText(finalPrompt),
                    Part.fromText("Nguồn để lấy thông tin ngày và loại report: " + question)
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
