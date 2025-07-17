package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CustomerSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.OrderSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.RevenueSummary;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardSummaryInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardSummaryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class DashBoardSummaryUseCaseInteraction implements DashBoardSummaryInputBoundary {

    private final OrderRepository orderRepository;
    private final DashBoardSummaryOutputBoundary dashBoardSummaryOutputBoundary;

    @Override
    public DashBoardSummaryOutputData getDashBoardSummary(DashBoardSummaryInputData dashBoardSummaryInputData) {
        OrderSummary orderSummary = getOrderSummary(dashBoardSummaryInputData.getFilterBy());
        CustomerSummary customerSummary = getCustomerSummary(dashBoardSummaryInputData.getFilterBy());
        RevenueSummary revenueSummary = getRevenueSummary(dashBoardSummaryInputData.getFilterBy());

        return dashBoardSummaryOutputBoundary.convertToDashBoardSummaryOutputData(
                orderSummary, customerSummary, revenueSummary
        );
    }

    private OrderSummary getOrderSummary(String filterBy) {
        Map<String, LocalDateTime> timeRange = getTimeRange(filterBy);
        Long totalOrderCurrent = orderRepository.countByOrderDateBetween(timeRange.get("start"), timeRange.get("now"));
        Long totalOrderLast = orderRepository.countByOrderDateBetween(timeRange.get("lastStartTime"),
                timeRange.get("lastSameTime"));
        Double orderGrowthRate = getOrderGrowthRate(totalOrderCurrent, totalOrderLast);
        Long notProcessedOrder = orderRepository.countByOrderStatus(OrderStatus.PROCESSING);

        Long processedOrder = orderRepository.countByOrderStatus(OrderStatus.SHIPPING);
        return new OrderSummary(totalOrderCurrent, orderGrowthRate, notProcessedOrder, processedOrder);
    }

    private Double getOrderGrowthRate(Long current, Long last) {
        if (last == 0) {
            if (current == 0) {
                return 0.0;
            }
            return 100.0;
        }
        return (double) ((current - last) / last * 100);
    }

    private CustomerSummary getCustomerSummary(String filterBy) {
        Map<String, LocalDateTime> timeRange = getTimeRange(filterBy);
        Long totalOrderedCustomerCurrent = orderRepository.countBuyingCustomers(
                timeRange.get("start"), timeRange.get("now")
        );
        Long totalOrderedCustomerLast = orderRepository.countBuyingCustomers(
                timeRange.get("lastStartTime"), timeRange.get("lastSameTime")
        );
        Double customerGrowthRate = getCustomerGrowthRate(totalOrderedCustomerCurrent, totalOrderedCustomerLast);
        return new CustomerSummary(totalOrderedCustomerCurrent, customerGrowthRate);
    }

    private Double getCustomerGrowthRate(Long current, Long last) {
        if (last == 0) {
            if (current == 0) {
                return 0.0;
            }
            return 100.0;
        }
        return (double) ((current - last) / last * 100);
    }

    private RevenueSummary getRevenueSummary(String filterBy) {
        Map<String, LocalDateTime> timeRange = getTimeRange(filterBy);

        //Get current revenue
        BigDecimal resultCurrent = orderRepository.getTotalRevenueBetween(
                timeRange.get("start"), timeRange.get("now"));

        BigDecimal totalRevenueCurrent = resultCurrent == null ? BigDecimal.ZERO : resultCurrent;


        //Get last revenue
        BigDecimal resultLast = orderRepository.getTotalRevenueBetween(
                timeRange.get("lastStartTime"), timeRange.get("lastSameTime")
        );
        BigDecimal totalRevenueLast = resultLast == null ? BigDecimal.ZERO : resultLast;

        Double revenueGrowthRate = getRevenueGrowthRate(totalRevenueCurrent, totalRevenueLast);
        return new RevenueSummary(totalRevenueCurrent, revenueGrowthRate);
    }

    private Double getRevenueGrowthRate(BigDecimal current, BigDecimal last) {
        if (last.compareTo(BigDecimal.ZERO) == 0) {
            if (current.compareTo(BigDecimal.ZERO) == 0) {
                return BigDecimal.ZERO.doubleValue();
            }
            return BigDecimal.valueOf(100).doubleValue();
        }

        MathContext mc = new MathContext(4, RoundingMode.HALF_UP);

        return current.subtract(last)
                .divide(last, mc)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }



    private Map<String, LocalDateTime> getTimeRange(String filterBy) {
        Map<String, LocalDateTime> timeRange = new HashMap<>();
        switch (filterBy) {
            case "month" -> {
                LocalDateTime nowMonth = LocalDateTime.now();
                LocalDateTime startMonth = nowMonth.withMonth(1).toLocalDate().atStartOfDay();
                LocalDateTime lastMonthSameTime = nowMonth.minusMonths(1);
                LocalDateTime lastMonthStartTime = startMonth.minusMonths(1);
                timeRange.put("start", startMonth);
                timeRange.put("now", nowMonth);
                timeRange.put("lastStarTime", lastMonthStartTime);
                timeRange.put("lastSameTime", lastMonthSameTime);
                return timeRange;
            }
            case "year" -> {
                LocalDateTime nowYear = LocalDateTime.now();
                LocalDateTime startYear = nowYear.withYear(1).toLocalDate().atStartOfDay();
                LocalDateTime lastYearSameTime = nowYear.minusYears(1);
                LocalDateTime lastYearStartTime = startYear.minusYears(1);
                timeRange.put("start", startYear);
                timeRange.put("now", nowYear);
                timeRange.put("lastStarTime", lastYearStartTime);
                timeRange.put("lastSameTime", lastYearSameTime);
                return timeRange;
            }
            default -> {
                LocalDateTime nowWeek = LocalDateTime.now();
                LocalDateTime startWeek = nowWeek.minusDays(nowWeek.getDayOfWeek().getValue() - 1)
                        .toLocalDate()
                        .atStartOfDay();
                LocalDateTime lastWeekSameTime = nowWeek.minusWeeks(1);
                LocalDateTime lastWeekStartTime = startWeek.minusWeeks(1);
                timeRange.put("start", startWeek);
                timeRange.put("now", nowWeek);
                timeRange.put("lastStartTime", lastWeekStartTime);
                timeRange.put("lastSameTime", lastWeekSameTime);
                return timeRange;
            }
        }
    }
}
