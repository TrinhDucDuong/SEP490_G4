package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.infrastructure.repository.ColorRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.ColorEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ColorOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListColorOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.ColorUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ColorUseCaseInteractionTest {
    @Mock
    private ColorRepository colorRepository;

    @Mock
    private ColorOutputBoundary colorOutputBoundary;

    @InjectMocks
    private ColorUseCaseInteraction useCase;

    private List<ColorEntity> mockColorEntities;
    private List<String> mockColorHexes;
    private ListColorOutputData mockOutputData;

    @BeforeEach
    void setUp() {
        mockColorEntities = List.of(
                ColorEntity.builder().colorHex("#FFFFFF").build(),
                ColorEntity.builder().colorHex("#000000").build()
        );

        mockColorHexes = List.of("#FFFFFF", "#000000");
        mockOutputData = new ListColorOutputData(mockColorHexes);
    }

    @Test
    void testGetAll_ShouldReturnListColorOutputData() {
        // given
        when(colorRepository.findAll()).thenReturn(mockColorEntities);
        when(colorOutputBoundary.convertToListColorOutputData(mockColorHexes)).thenReturn(mockOutputData);

        // when
        ListColorOutputData result = useCase.getAll();

        // then
        assertEquals(mockOutputData, result);
        verify(colorRepository).findAll();
        verify(colorOutputBoundary).convertToListColorOutputData(mockColorHexes);
    }
}
