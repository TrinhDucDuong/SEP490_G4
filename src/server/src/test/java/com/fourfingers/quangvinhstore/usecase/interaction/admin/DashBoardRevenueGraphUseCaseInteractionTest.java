package com.fourfingers.quangvinhstore.usecase.interaction.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardRevenueGraphOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.admin.DashBoardRevenueGraphUseCaseInteraction;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class DashBoardRevenueGraphUseCaseInteractionTest {
    @InjectMocks
    private DashBoardRevenueGraphUseCaseInteraction useCase;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private DashBoardRevenueGraphOutputBoundary outputBoundary;

    @Test
    @DisplayName("Should throw exception when startTime is after endTime")
    void testInvalidTime_ShouldThrowException() {
        // Arrange
        LocalDateTime start = LocalDateTime.of(2023, 1, 10, 0, 0);
        LocalDateTime end = LocalDateTime.of(2023, 1, 1, 0, 0);
        var inputData = new DashBoardRevenueGraphInputData(start, end);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> useCase.getDashBoardRevenueGraph(inputData));
    }

    @Test
    @DisplayName("Should fill missing dates and return full revenue list")
    void testFillMissingDatesAndReturnFullList() {
        // Arrange
        LocalDateTime start = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2023, 1, 5, 0, 0);
        var inputData = new DashBoardRevenueGraphInputData(start, end);

        // only Jan 2 and Jan 4 have revenue
        List<DailyRevenue> revenueList = List.of(
                new DailyRevenue(start.plusDays(1), new BigDecimal("100000")),
                new DailyRevenue(start.plusDays(3), new BigDecimal("200000"))
        );

        List<DailyRevenue> expectedFilled = List.of(
                new DailyRevenue(start.withHour(0), BigDecimal.ZERO),
                new DailyRevenue(start.plusDays(1).withHour(0), new BigDecimal("100000")),
                new DailyRevenue(start.plusDays(2).withHour(0), BigDecimal.ZERO),
                new DailyRevenue(start.plusDays(3).withHour(0), new BigDecimal("200000")),
                new DailyRevenue(start.plusDays(4).withHour(0), BigDecimal.ZERO)
        );

        DashBoardRevenueGraphOutputData output = new DashBoardRevenueGraphOutputData(); // stub

        when(orderRepository.getRevenuePerDay(start, end)).thenReturn(revenueList);
        when(outputBoundary.convertToDashBoardRevenueGraphOutputData(any())).thenReturn(output);

        // Act
        DashBoardRevenueGraphOutputData result = useCase.getDashBoardRevenueGraph(inputData);

        // Assert
        assertEquals(output, result);

        // Verify repo called
        verify(orderRepository).getRevenuePerDay(start, end);
        // Verify convert called with filled data
        ArgumentCaptor<List<DailyRevenue>> captor = ArgumentCaptor.forClass(List.class);
        verify(outputBoundary).convertToDashBoardRevenueGraphOutputData(captor.capture());

        List<DailyRevenue> actualFilled = captor.getValue();
        assertEquals(expectedFilled.size(), actualFilled.size());

        for (int i = 0; i < expectedFilled.size(); i++) {
            assertEquals(expectedFilled.get(i).getDate().toLocalDate(), actualFilled.get(i).getDate().toLocalDate());
            assertEquals(expectedFilled.get(i).getRevenueByDay(), actualFilled.get(i).getRevenueByDay());
        }
    }
}
