package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardRevenueGraphInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardRevenueGraphOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class DashBoardRevenueGraphUseCaseInteraction implements DashBoardRevenueGraphInputBoundary {
    private final OrderRepository orderRepository;
    private final DashBoardRevenueGraphOutputBoundary dashBoardRevenueGraphOutputBoundary;

    @Override
    public DashBoardRevenueGraphOutputData getDashBoardRevenueGraph(DashBoardRevenueGraphInputData
                                                                            dashBoardRevenueGraphInputData) {
        if(dashBoardRevenueGraphInputData.getStartTime().isAfter(dashBoardRevenueGraphInputData.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        List<DailyRevenue> daysHavingRevenue = orderRepository.getRevenuePerDay(
                dashBoardRevenueGraphInputData.getStartTime(),
                dashBoardRevenueGraphInputData.getEndTime()
        );
        List<DailyRevenue> dailyRevenues = fillMissingDates(daysHavingRevenue,
                dashBoardRevenueGraphInputData.getStartTime(),
                dashBoardRevenueGraphInputData.getEndTime());
        return dashBoardRevenueGraphOutputBoundary.convertToDashBoardRevenueGraphOutputData(dailyRevenues);
    }

    //Fill the days that don't having revenue
    private List<DailyRevenue> fillMissingDates(List<DailyRevenue> data, LocalDateTime start, LocalDateTime end) {
        Map<LocalDate, BigDecimal> revenueMap = data.stream()
                .collect(Collectors.toMap(
                        d -> d.getDate().toLocalDate(),
                        DailyRevenue::getRevenueByDay
                ));

        List<DailyRevenue> result = new ArrayList<>();
        for (LocalDate date = start.toLocalDate(); !date.isAfter(end.toLocalDate()); date = date.plusDays(1)) {
            result.add(new DailyRevenue(date.atStartOfDay(), revenueMap.getOrDefault(date, BigDecimal.ZERO)));
        }
        return result;
    }
}
