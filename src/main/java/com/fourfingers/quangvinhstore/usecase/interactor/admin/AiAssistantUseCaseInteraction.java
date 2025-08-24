package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue;
import com.fourfingers.quangvinhstore.infrastructure.config.websocket.ClientManager;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureSpeechBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.GenAiUtilBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.AiAssistantInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * This class handles AI assistant interactions for the admin interface.
 * It processes voice commands, manages WebSocket connections, and provides
 * information about orders and revenue within specified time ranges.
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AiAssistantUseCaseInteraction implements AiAssistantInputBoundary {
    /**
     * Service for Azure speech-to-text and text-to-speech conversion
     */
    private final AzureSpeechBoundary azureSpeechBoundary;
    /**
     * Service for AI-powered text analysis and response generation
     */
    private final GenAiUtilBoundary genAiUtilBoundary;
    /**
     * Repository for accessing order data
     */
    private final OrderRepository orderRepository;
    /**
     * Manager for WebSocket client connections
     */
    private final ClientManager clientManager;

    /**
     * Processes the question and related information to generate an appropriate answer.
     *
     * @param relatedInfo Information about the type of data and time range
     * @param question    The user's question to be answered
     * @return Generated answer based on the available data
     */
    private String getAnswer(String relatedInfo, String question) {
        String[] info = relatedInfo.split(" ");
        if(info.length < 3) {
            return "Tôi đang chưa hiểu câu hỏi của bạn. Kính mong bạn hỏi lại.";
        }
        LocalDateTime[] range = getTimeRange(info);
        if (range == null) {
            return "Tôi đang không thể hiểu được khoảng thời gian, " +
                   "bạn có thể cung cấp rõ hơn không ạ";
        }
        if (isOrderRelated(info[0])) {
            String orderInfo = getOrderInfo(range);
            return genAiUtilBoundary.getAnswerAiAssistant(orderInfo, question);
        }
        if(isRevenueRelated(info[0])) {
            String revenueInfo = getRevenueInfo(range);
            return genAiUtilBoundary.getAnswerAiAssistant(revenueInfo, question);
        }
        return "Xin lỗi tôi chưa hiểu câu hỏi của bạn";
    }

    /**
     * Checks if the query is related to order information.
     *
     * @param info The type identifier from the query
     * @return true if the query is order-related, false otherwise
     */
    private boolean isOrderRelated(String info) {
        return info.equalsIgnoreCase("order");
    }

    /**
     * Checks if the query is related to revenue information.
     *
     * @param info The type identifier from the query
     * @return true if the query is revenue-related, false otherwise
     */
    private boolean isRevenueRelated(String info) {
        return info.equalsIgnoreCase("revenue");
    }

    /**
     * Parses and validates the time range from the input information.
     *
     * @param info Array containing the time range information
     * @return Array of LocalDateTime containing start and end dates, or null if invalid
     */
    private LocalDateTime[] getTimeRange(String[] info) {
        try {
            LocalDateTime start = LocalDateTime.parse(info[1]);
            LocalDateTime end = LocalDateTime.parse(info[2]);
            if (start.isAfter(end)) {
                return null;
            }
            return new LocalDateTime[] {start, end};
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    /**
     * Registers a new WebSocket client session.
     *
     * @param session The WebSocket session to register
     */
    @Override
    public void registerClient(WebSocketSession session) {
        clientManager.setSession(session);
    }

    /**
     * Removes a WebSocket client session.
     *
     * @param id The ID of the client to remove
     */
    @Override
    public void removeClient(String id) {
        clientManager.clearSession();
    }

    /**
     * Processes voice input from the client.
     * Converts speech to text, generates an answer, and sends back voice response.
     *
     * @param id      The client ID
     * @param payload The voice data payload
     */
    @Override
    public void handleVoice(String id, String payload) {
        String question = azureSpeechBoundary.speechToText(payload);
        String relatedInfo = genAiUtilBoundary.getAnswerAboutReportInformation(question);
        String answer = getAnswer(relatedInfo, question);
        String base64 = azureSpeechBoundary.textToSpeech(answer);
        clientManager.send(base64);
    }

    /**
     * Retrieves order statistics for a specific time range.
     *
     * @param range Array containing start and end dates
     * @return Formatted string containing order statistics
     */
    private String getOrderInfo(LocalDateTime[] range) {
        Long totalOrders = orderRepository.countByOrderDateBetween(range[0], range[1]);
        Long totalCanceledOrder = orderRepository
                .countByOrderStatusAndOrderDateBetween(OrderStatus.CANCELED, range[0], range[1]);
        Long totalDeliveredOrder = orderRepository
                .countByOrderStatusAndOrderDateBetween(OrderStatus.DELIVERED, range[0], range[1]);
        Long totalProcessingOrder = orderRepository
                .countByOrderStatusAndOrderDateBetween(OrderStatus.PROCESSING, range[0], range[1]);
        Long totalShippingOrder = orderRepository
                .countByOrderStatusAndOrderDateBetween(OrderStatus.SHIPPING, range[0], range[1]);
        return "Tổng lượng đơn hàng: " + totalOrders + "/n"
               + "Tổng lượng đơn hàng bị hủy" + totalCanceledOrder + "/n"
               + "Tổng đơn hàng đã giao thành công: " + totalDeliveredOrder + "/n"
               + "Tổng đơn hàng chưa xử lý: " + totalProcessingOrder + "/n"
               + "Tổng đơn hàng đang vận chuyển: " + totalShippingOrder;
    }

    /**
     * Retrieves revenue information for a specific time range.
     *
     * @param range Array containing start and end dates
     * @return Formatted string containing revenue statistics
     */
    private String getRevenueInfo(LocalDateTime[] range) {
        BigDecimal totalRevenue = orderRepository.getTotalRevenueBetween(range[0], range[1]);
        List<DailyRevenue> dailyRevenues = orderRepository.getRevenuePerDay(range[0], range[1]);

        StringBuilder builder = new StringBuilder();
        
        builder.append("Tổng doanh thu từ ")
                .append(range[0].toLocalDate())
                .append(" đến ")
                .append(range[1].toLocalDate())
                .append(" là: ")
                .append(formatCurrency(totalRevenue))
                .append(".\n");
        
        if (dailyRevenues == null || dailyRevenues.isEmpty()) {
            builder.append("Không có dữ liệu doanh thu chi tiết theo ngày.");
        } else {
            builder.append("Chi tiết doanh thu từng ngày:\n");
            for (DailyRevenue daily : dailyRevenues) {
                builder.append("- ")
                        .append(daily.getDate().toLocalDate())
                        .append(": ")
                        .append(formatCurrency(daily.getRevenueByDay()))
                        .append("\n");
            }
        }
        return builder.toString();
    }

    /**
     * Formats a decimal amount as VND currency string.
     *
     * @param amount The amount to format
     * @return Formatted currency string
     */
    private String formatCurrency(BigDecimal amount) {
        return String.format("%,.0f VNĐ", amount);
    }
}
