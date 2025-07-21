package com.fourfingers.quangvinhstore.usecase.interaction.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CustomerSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.OrderSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.RevenueSummary;
import com.fourfingers.quangvinhstore.infrastructure.repository.OrderRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.OrderStatus;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardSummaryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.admin.DashBoardSummaryUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class DashBoardSummaryUseCaseInteractionTest {
    @InjectMocks
    private DashBoardSummaryUseCaseInteraction useCase;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private DashBoardSummaryOutputBoundary outputBoundary;

    private OrderSummary mockOrderSummary;
    private CustomerSummary mockCustomerSummary;
    private RevenueSummary mockRevenueSummary;
    private DashBoardSummaryOutputData mockOutput;

    @BeforeEach
    void setUp() {
        mockOrderSummary = OrderSummary.builder()
                .notProcessedOrder(10L)
                .processedOrder(20L)
                .orderGrowthRate(100.0)
                .totalOrder(30L)
                .build();

        mockCustomerSummary = CustomerSummary.builder()
                .customerGrowthRate(100.0)
                .totalCustomer(30L)
                .build();

        mockRevenueSummary = RevenueSummary.builder()
                .totalRevenue(BigDecimal.valueOf(100000))
                .revenueGrowthRate(100.0)
                .build();

        mockOutput = new DashBoardSummaryOutputData(mockOrderSummary, mockCustomerSummary, mockRevenueSummary);
    }

    @Test
    void testSummaryForWeek_withPositiveData() {
        // Mock data for "week"
        when(orderRepository.countByOrderDateBetween(any(), any())).thenReturn(10L, 5L);
        when(orderRepository.countByOrderStatus(OrderStatus.PROCESSING)).thenReturn(10L);
        when(orderRepository.countByOrderStatus(OrderStatus.SHIPPING)).thenReturn(20L);
        when(orderRepository.countBuyingCustomers(any(), any())).thenReturn(15L, 5L);
        when(orderRepository.getTotalRevenueBetween(any(), any()))
                .thenReturn(BigDecimal.valueOf(100000), BigDecimal.valueOf(500));

        when(outputBoundary.convertToDashBoardSummaryOutputData(any(), any(), any()))
                .thenReturn(mockOutput);

        DashBoardSummaryInputData input = new DashBoardSummaryInputData("week");

        DashBoardSummaryOutputData result = useCase.getDashBoardSummary(input);
        assertEquals(mockOutput, result);
    }

    @Test
    void testSummaryForMonth_withPositiveData() {
        when(orderRepository.countByOrderDateBetween(any(), any())).thenReturn(8L, 4L);
        when(orderRepository.countByOrderStatus(OrderStatus.PROCESSING)).thenReturn(5L);
        when(orderRepository.countByOrderStatus(OrderStatus.SHIPPING)).thenReturn(12L);
        when(orderRepository.countBuyingCustomers(any(), any())).thenReturn(10L, 3L);
        when(orderRepository.getTotalRevenueBetween(any(), any()))
                .thenReturn(BigDecimal.valueOf(50000), BigDecimal.valueOf(20000));

        when(outputBoundary.convertToDashBoardSummaryOutputData(any(), any(), any()))
                .thenReturn(mockOutput);

        DashBoardSummaryInputData input = new DashBoardSummaryInputData("month");

        DashBoardSummaryOutputData result = useCase.getDashBoardSummary(input);
        assertEquals(mockOutput, result);
    }

    @Test
    void testSummaryForYear_withPositiveData() {
        when(orderRepository.countByOrderDateBetween(any(), any())).thenReturn(20L, 10L);
        when(orderRepository.countByOrderStatus(OrderStatus.PROCESSING)).thenReturn(6L);
        when(orderRepository.countByOrderStatus(OrderStatus.SHIPPING)).thenReturn(14L);
        when(orderRepository.countBuyingCustomers(any(), any())).thenReturn(18L, 9L);
        when(orderRepository.getTotalRevenueBetween(any(), any()))
                .thenReturn(BigDecimal.valueOf(120000), BigDecimal.valueOf(60000));

        when(outputBoundary.convertToDashBoardSummaryOutputData(any(), any(), any()))
                .thenReturn(mockOutput);

        DashBoardSummaryInputData input = new DashBoardSummaryInputData("year");

        DashBoardSummaryOutputData result = useCase.getDashBoardSummary(input);
        assertEquals(mockOutput, result);
    }

    @Test
    void testSummaryForInvalidFilter_shouldDefaultToWeek() {
        when(orderRepository.countByOrderDateBetween(any(), any())).thenReturn(6L, 3L);
        when(orderRepository.countByOrderStatus(OrderStatus.PROCESSING)).thenReturn(4L);
        when(orderRepository.countByOrderStatus(OrderStatus.SHIPPING)).thenReturn(7L);
        when(orderRepository.countBuyingCustomers(any(), any())).thenReturn(9L, 2L);
        when(orderRepository.getTotalRevenueBetween(any(), any()))
                .thenReturn(BigDecimal.valueOf(70000), BigDecimal.valueOf(20000));

        when(outputBoundary.convertToDashBoardSummaryOutputData(any(), any(), any()))
                .thenReturn(mockOutput);

        DashBoardSummaryInputData input = new DashBoardSummaryInputData("invalid");

        DashBoardSummaryOutputData result = useCase.getDashBoardSummary(input);
        assertEquals(mockOutput, result);
    }

    @Test
    void testRevenueGrowthRate_whenBothCurrentAndLastAreZero_shouldReturnZero() {
        BigDecimal current = BigDecimal.ZERO;
        BigDecimal last = BigDecimal.ZERO;

        Double result = ReflectionTestUtils.invokeMethod(useCase, "getRevenueGrowthRate", current, last);

        assertEquals(0.0, result);
    }

    @Test
    void testRevenueGrowthRate_whenLastIsZeroButCurrentIsNot_shouldReturn100() {
        BigDecimal current = BigDecimal.valueOf(100);
        BigDecimal last = BigDecimal.ZERO;

        Double result = ReflectionTestUtils.invokeMethod(useCase, "getRevenueGrowthRate", current, last);

        assertEquals(100.0, result);
    }

    @Test
    void testCustomerGrowthRate_whenBothZero_shouldReturnZero() {
        Double result = ReflectionTestUtils.invokeMethod(useCase, "getCustomerGrowthRate", 0L, 0L);

        assertEquals(0.0, result);
    }

    @Test
    void testCustomerGrowthRate_whenLastZeroCurrentPositive_shouldReturn100() {
        Double result = ReflectionTestUtils.invokeMethod(useCase, "getCustomerGrowthRate", 10L, 0L);

        assertEquals(100.0, result);
    }

    @Test
    void testOrderGrowthRate_whenBothZero_shouldReturnZero() {
        Double result = ReflectionTestUtils.invokeMethod(useCase, "getOrderGrowthRate", 0L, 0L);

        assertEquals(0.0, result);
    }

    @Test
    void testOrderGrowthRate_whenLastZeroCurrentPositive_shouldReturn100() {
        Double result = ReflectionTestUtils.invokeMethod(useCase, "getOrderGrowthRate", 20L, 0L);

        assertEquals(100.0, result);
    }

    @Test
    void testGetRevenueSummary_whenCurrentRevenueIsNull_shouldFallbackToZero() {
        // Arrange
        DashBoardSummaryInputData input = new DashBoardSummaryInputData("week");

        when(orderRepository.countByOrderDateBetween(any(), any())).thenReturn(0L, 0L);
        when(orderRepository.countByOrderStatus(OrderStatus.PROCESSING)).thenReturn(0L);
        when(orderRepository.countByOrderStatus(OrderStatus.SHIPPING)).thenReturn(0L);
        when(orderRepository.countBuyingCustomers(any(), any())).thenReturn(0L, 0L);

        when(orderRepository.getTotalRevenueBetween(any(), any()))
                .thenReturn(null, BigDecimal.valueOf(500)); // resultCurrent == null

        RevenueSummary expectedRevenue = new RevenueSummary(BigDecimal.ZERO, 100.0);
        OrderSummary expectedOrder = new OrderSummary(0L, 100.0, 0L, 0L);
        CustomerSummary expectedCustomer = new CustomerSummary(0L, 100.0);
        DashBoardSummaryOutputData expected = new DashBoardSummaryOutputData(expectedOrder, expectedCustomer, expectedRevenue);

        when(outputBoundary.convertToDashBoardSummaryOutputData(any(), any(), any()))
                .thenReturn(expected);

        DashBoardSummaryOutputData result = useCase.getDashBoardSummary(input);

        assertEquals(expected, result);
    }

    @Test
    void testGetRevenueSummary_whenLastRevenueIsNull_shouldFallbackToZero() {
        DashBoardSummaryInputData input = new DashBoardSummaryInputData("week");

        when(orderRepository.countByOrderDateBetween(any(), any())).thenReturn(10L, 0L);
        when(orderRepository.countByOrderStatus(OrderStatus.PROCESSING)).thenReturn(5L);
        when(orderRepository.countByOrderStatus(OrderStatus.SHIPPING)).thenReturn(10L);
        when(orderRepository.countBuyingCustomers(any(), any())).thenReturn(10L, 0L);

        when(orderRepository.getTotalRevenueBetween(any(), any()))
                .thenReturn(BigDecimal.valueOf(1000), null);

        RevenueSummary expectedRevenue = new RevenueSummary(BigDecimal.valueOf(1000), 100.0);
        OrderSummary expectedOrder = new OrderSummary(10L, 100.0, 5L, 10L);
        CustomerSummary expectedCustomer = new CustomerSummary(10L, 100.0);
        DashBoardSummaryOutputData expected = new DashBoardSummaryOutputData(expectedOrder, expectedCustomer, expectedRevenue);

        when(outputBoundary.convertToDashBoardSummaryOutputData(any(), any(), any()))
                .thenReturn(expected);

        DashBoardSummaryOutputData result = useCase.getDashBoardSummary(input);

        assertEquals(expected, result);
    }

}
