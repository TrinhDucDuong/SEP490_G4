package com.fourfingers.quangvinhstore.usecase.interaction.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CategorySalesReport;
import com.fourfingers.quangvinhstore.infrastructure.repository.CategoryRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardCategorySalesOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.admin.DashBoardCategorySalesUseCaseInteraction;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@SpringBootTest
public class DashboardCategorySalesUseCaseInteractionTest {
    @InjectMocks
    private DashBoardCategorySalesUseCaseInteraction useCase;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private DashBoardCategorySalesOutputBoundary outputBoundary;

    @Test
    @DisplayName("Should throw exception when startTime is after endTime")
    void testGetCategorySales_InvalidTime_ThrowsException() {
        // Arrange
        DashBoardCategorySalesInputData inputData = new DashBoardCategorySalesInputData(
                LocalDateTime.of(2024, 10, 10, 12, 0),
                LocalDateTime.of(2024, 9, 9, 12, 0)
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            useCase.getCategorySales(inputData);
        });
    }

    @Test
    @DisplayName("Should return category sales report when time is valid")
    void testGetCategorySales_ValidTime_ReturnsOutputData() {
        // Arrange
        LocalDateTime start = LocalDateTime.of(2024, 9, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 9, 30, 23, 59);

        DashBoardCategorySalesInputData inputData = new DashBoardCategorySalesInputData(start, end);

        List<CategorySalesReport> mockReports = List.of(
                new CategorySalesReport("Shirts", 100L),
                new CategorySalesReport("Jeans", 50L)
        );

        DashBoardCategorySalesOutputData expectedOutput = new DashBoardCategorySalesOutputData();

        when(categoryRepository.getCategorySalesReport(start, end)).thenReturn(mockReports);
        when(outputBoundary.convertToDashBoardCategorySalesOutputData(mockReports)).thenReturn(expectedOutput);

        // Act
        DashBoardCategorySalesOutputData actualOutput = useCase.getCategorySales(inputData);

        // Assert
        assertEquals(expectedOutput, actualOutput);
        verify(categoryRepository, times(1)).getCategorySalesReport(start, end);
        verify(outputBoundary, times(1)).convertToDashBoardCategorySalesOutputData(mockReports);
    }
}
