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

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AiAssistantUseCaseInteraction implements AiAssistantInputBoundary {
    private final AzureSpeechBoundary azureSpeechBoundary;
    private final GenAiUtilBoundary genAiUtilBoundary;
    private final OrderRepository orderRepository;
    private final ClientManager clientManager;

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

    private boolean isOrderRelated(String info) {
        return info.equalsIgnoreCase("order");
    }

    private boolean isRevenueRelated(String info) {
        return info.equalsIgnoreCase("revenue");
    }

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

    @Override
    public void registerClient(WebSocketSession session) {
        clientManager.setSession(session);
    }

    @Override
    public void removeClient(String id) {
        clientManager.clearSession();
    }

    @Override
    public void handleVoice(String id, String payload) {
        String question = azureSpeechBoundary.speechToText(payload);
        String relatedInfo = genAiUtilBoundary.getAnswerAboutReportInformation(question);
        String answer = getAnswer(relatedInfo, question);
        String base64 = azureSpeechBoundary.textToSpeech(answer);
        clientManager.send(base64);
    }

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

    private String getRevenueInfo(LocalDateTime[] range) {
        BigDecimal totalRevenue = orderRepository.getTotalRevenueBetween(range[0], range[1]);
        List<DailyRevenue> dailyRevenues = orderRepository.getRevenuePerDay(range[0], range[1]);

        StringBuilder builder = new StringBuilder();

        // Thêm tổng doanh thu
        builder.append("Tổng doanh thu từ ")
                .append(range[0].toLocalDate())
                .append(" đến ")
                .append(range[1].toLocalDate())
                .append(" là: ")
                .append(formatCurrency(totalRevenue))
                .append(".\n");

        // Thêm chi tiết từng ngày
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

    private String formatCurrency(BigDecimal amount) {
        return String.format("%,.0f VNĐ", amount);
    }
}
