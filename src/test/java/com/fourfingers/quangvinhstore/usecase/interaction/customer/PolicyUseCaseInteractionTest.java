package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Policy;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.PolicyMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.PolicyRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.PolicyEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.PolicyOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.PolicyUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PolicyUseCaseInteractionTest {

    @Mock
    private PolicyRepository policyRepository;

    @Mock
    private PolicyOutputBoundary policyOutputBoundary;

    @Mock
    private PolicyMapper policyMapper;

    @InjectMocks
    private PolicyUseCaseInteraction useCase;

    private PolicyEntity mockPolicyEntity;
    private Policy mockPolicy;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockPolicyEntity = PolicyEntity.builder()
                .policyId(1L)
                .policyName("Free Returns")
                .policyDescription("Free Returns")
                .isActive(true)
                .build();

        mockPolicy = Policy.builder()
                .policyId(1L)
                .policyName("Free Returns")
                .policyDescription("Free Returns")
                .build();
    }

    @Test
    void testFindAll_shouldReturnActivePolicies() {
        // arrange
        when(policyRepository.findAllByIsActive(true)).thenReturn(List.of(mockPolicyEntity));
        when(policyMapper.toPolicy(mockPolicyEntity)).thenReturn(mockPolicy);
        when(policyOutputBoundary.convertToListPolicyOutputData(any()))
                .thenReturn(new ListPolicyOutputData());

        // act
        ListPolicyOutputData result = useCase.findAll();

        // assert
        assertNotNull(result);
        verify(policyRepository).findAllByIsActive(true);
        verify(policyMapper).toPolicy(mockPolicyEntity);
        verify(policyOutputBoundary).convertToListPolicyOutputData(any());
    }
}
