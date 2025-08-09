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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AiAssistantUseCaseInteraction implements AiAssistantInputBoundary {
    private final AzureSpeechBoundary azureSpeechBoundary;
    private final GenAiUtilBoundary genAiUtilBoundary;
    private final OrderRepository orderRepository;
    private final ClientManager clientManager;

    private String getAnswer(String question) {
        LocalDateTime[] range = extractDateKeywordAndRange(question.toLowerCase());
        if (range == null) {
            return "Tôi đang không thể hiểu được khoảng thời gian, " +
                   "bạn có thể cung cấp rõ hơn không ạ";
        }
        if (isOrderRelated(question)) {
            String orderInfo = getOrderInfo(range);
            return genAiUtilBoundary.getAnswerAiAssistant(orderInfo, question);
        }
        if(isRevenueRelated(question)) {
            String revenueInfo = getRevenueInfo(range);
            return genAiUtilBoundary.getAnswerAiAssistant(revenueInfo, question);
        }
        return "Xin lỗi tôi chưa hiểu câu hỏi của bạn";
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
        int a = 5;
        String answer = getAnswer(question);
        String base64 = azureSpeechBoundary.textToSpeech(answer);
        clientManager.send(base64);
    }

    private boolean isOrderRelated(String question) {
        if (question == null || question.isBlank()) return false;
        String normalized = question.toLowerCase();
        String[] orderKeywords = {
                "đơn hàng", "đơn", "mua hàng", "mua", "đặt hàng", "đặt", "giao hàng", "ship", "vận chuyển",
                "tình trạng đơn", "trạng thái đơn", "đơn của tôi", "kiểm tra đơn", "check đơn", "theo dõi đơn",
                "bao giờ giao", "giao lúc nào", "bao lâu nhận", "thời gian giao", "giao đến chưa", "giao chưa",
                "số đơn", "mã đơn", "order id", "order status", "delivery status", "tracking number",
                "track đơn", "tracking", "bao giờ tới", "bao lâu tới", "tình hình giao", "cập nhật đơn hàng",
                "có đơn chưa", "đơn mới", "đơn cũ", "đơn gần nhất", "lịch sử mua", "history", "đặt bao nhiêu",
                "tổng đơn", "bao nhiêu đơn", "hôm nay có đơn", "đơn ngày", "đơn tháng", "đơn năm",
                "mua mấy cái", "order count", "số lượng đơn", "order quantity", "số lần mua",
                "đơn chưa giao", "đơn đã giao", "đơn bị huỷ", "huỷ đơn", "reorder", "mua lại",
                "đơn thành công", "đơn thất bại", "xử lý đơn", "pending", "shipped", "delivered",
                "chưa nhận được", "giao lỗi", "trễ đơn", "trễ giao", "lỗi đơn", "xem đơn"
        };
        for (String keyword : orderKeywords) {
            if (normalized.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    public static LocalDateTime[] getTimeRange(String keyword) {
        LocalDate today = LocalDate.now();
        switch (keyword) {
            case "today" -> {
                return new LocalDateTime[]{
                        today.atStartOfDay(),
                        today.atTime(LocalTime.MAX)
                };
            }
            case "yesterday" -> {
                LocalDate yest = today.minusDays(1);
                return new LocalDateTime[]{
                        yest.atStartOfDay(),
                        yest.atTime(LocalTime.MAX)
                };
            }
            case "tomorrow" -> {
                LocalDate tomo = today.plusDays(1);
                return new LocalDateTime[]{
                        tomo.atStartOfDay(),
                        tomo.atTime(LocalTime.MAX)
                };
            }
            case "this_week" -> {
                LocalDate start = today.with(DayOfWeek.MONDAY);
                LocalDate end = today.with(DayOfWeek.SUNDAY);
                return new LocalDateTime[]{
                        start.atStartOfDay(),
                        end.atTime(LocalTime.MAX)
                };
            }
            case "last_week" -> {
                LocalDate start = today.minusWeeks(1).with(DayOfWeek.MONDAY);
                LocalDate end = today.minusWeeks(1).with(DayOfWeek.SUNDAY);
                return new LocalDateTime[]{
                        start.atStartOfDay(),
                        end.atTime(LocalTime.MAX)
                };
            }
            case "this_month" -> {
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
                return new LocalDateTime[]{
                        start.atStartOfDay(),
                        end.atTime(LocalTime.MAX)
                };
            }
            case "last_month" -> {
                LocalDate lastMonth = today.minusMonths(1);
                return new LocalDateTime[]{
                        lastMonth.withDayOfMonth(1).atStartOfDay(),
                        lastMonth.withDayOfMonth(lastMonth.lengthOfMonth()).atTime(LocalTime.MAX)
                };
            }
            case "this_year" -> {
                LocalDate start = today.withDayOfYear(1);
                LocalDate end = today.withDayOfYear(today.lengthOfYear());
                return new LocalDateTime[]{
                        start.atStartOfDay(),
                        end.atTime(LocalTime.MAX)
                };
            }
            case "last_year" -> {
                LocalDate lastYear = today.minusYears(1);
                return new LocalDateTime[]{
                        lastYear.withDayOfYear(1).atStartOfDay(),
                        lastYear.withDayOfYear(lastYear.lengthOfYear()).atTime(LocalTime.MAX)
                };
            }
            default -> {
                return null;
            }
        }
    }

    private LocalDateTime[] extractDateKeywordAndRange(String question) {
        String lower = question.toLowerCase();
        Pattern rangePattern = Pattern.compile(
                "từ\\s+ngày\\s+(\\d{1,2})\\s+tháng\\s+(\\d{1,2})\\s+năm\\s+(\\d{4})\\s+" +
                "(?:đến|->|tới)\\s+ngày\\s+(\\d{1,2})\\s+tháng\\s+(\\d{1,2})\\s+năm\\s+(\\d{4})"
        );
        Matcher rangeMatcher = rangePattern.matcher(lower);
        if (rangeMatcher.find()) {
            try {
                // Lấy ngày bắt đầu
                int startDay = Integer.parseInt(rangeMatcher.group(1));
                int startMonth = Integer.parseInt(rangeMatcher.group(2));
                int startYear = rangeMatcher.group(3) != null ? Integer.parseInt(rangeMatcher.group(3)) : LocalDate
                        .now().getYear();

                // Lấy ngày kết thúc
                int endDay = Integer.parseInt(rangeMatcher.group(4));
                int endMonth = Integer.parseInt(rangeMatcher.group(5));
                int endYear = rangeMatcher.group(6) != null ? Integer.parseInt(rangeMatcher.group(6)) : LocalDate.now().getYear();

                LocalDateTime start = LocalDate.of(startYear, startMonth, startDay).atStartOfDay();
                LocalDateTime end = LocalDate.of(endYear, endMonth, endDay).atTime(LocalTime.MAX);

                return new LocalDateTime[]{start, end};
            } catch (Exception e) {
                // Log ra nếu muốn
                return null;
            }
        }

        String keyword = null;
        if (lower.contains("hôm nay")) keyword = "today";
        else if (lower.contains("hôm qua")) keyword = "yesterday";
        else if (lower.contains("ngày mai")) keyword = "tomorrow";
        else if (lower.contains("tuần này")) keyword = "this_week";
        else if (lower.contains("tuần trước")) keyword = "last_week";
        else if (lower.contains("tháng này")) keyword = "this_month";
        else if (lower.contains("tháng trước")) keyword = "last_month";
        else if (lower.contains("năm nay")) keyword = "this_year";
        else if (lower.contains("năm ngoái")) keyword = "last_year";

        return keyword != null ? getTimeRange(keyword) : null;
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

    private boolean isRevenueRelated(String question) {
        String normalized = question.toLowerCase();
        String[] revenueKeywords = {
                "doanh thu", "thu nhập", "tổng thu", "tiền vào", "thu về", "income", "revenue", "gross revenue",
                "net revenue", "lợi nhuận", "lãi", "lợi nhuận gộp", "lợi nhuận ròng", "lợi nhuận thuần",
                "gross profit", "net profit", "profit margin", "biên lợi nhuận", "thu được", "đạt được",
                "doanh số", "sales", "total sales", "turnover", "money earned", "amount earned", "số tiền kiếm được",
                "báo cáo doanh thu", "báo cáo lợi nhuận", "tình hình doanh thu", "tình hình tài chính",
                "doanh thu hôm nay", "doanh thu tháng", "doanh thu năm", "thu nhập quý", "báo cáo quý",
                "bao nhiêu tiền", "được bao nhiêu", "đã thu bao nhiêu", "đạt doanh thu", "thu nhập bao nhiêu",
                "đạt mục tiêu", "vượt chỉ tiêu", "số tiền", "mức thu", "doanh thu trung bình", "average revenue",
                "revenue report", "báo cáo thu nhập", "revenue today", "revenue this month", "revenue last month",
                "profit today", "profit this year", "money this week"
        };
        for (String keyword : revenueKeywords) {
            if (normalized.contains(keyword)) {
                return true;
            }
        }
        return false;
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
