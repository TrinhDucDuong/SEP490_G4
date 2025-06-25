//package com.fourfingers.quangvinhstore.usecase;
//
//import com.fourfingers.quangvinhstore.domain.model.customer.Policy;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.PolicyMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.PolicyRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.PolicyEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.customer.PolicyOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.output.policy.ListPolicyOutputData;
//import com.fourfingers.quangvinhstore.usecase.interactor.ViewPolicyUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.anyList;
//import static org.mockito.Mockito.*;
//
//@SpringBootTest
//@ActiveProfiles("test")
//public class ViewPolicyUseCaseInteractionTest {
//    @Mock
//    private PolicyRepository policyRepository;
//
//    @Mock
//    private PolicyMapper policyMapper;
//
//    @Mock
//    private PolicyOutputBoundary policyOutputBoundary;
//
//    @InjectMocks
//    private ViewPolicyUseCaseInteraction viewPolicyUseCaseInteraction;
//
//    private PolicyEntity mockPolicyEntity;
//    private Policy mockPolicy;
//    private ListPolicyOutputData mockListPolicyOutputData;
//
//
//    @BeforeEach
//    void setUp() {
//        mockPolicyEntity = new PolicyEntity();
//        mockPolicy = new Policy();
//        mockListPolicyOutputData = new ListPolicyOutputData();
//    }
//
//    @Test
//    public void testFindAllSuccess() {
//        when(policyRepository.findAllByIsActive(true)).thenReturn(List.of(mockPolicyEntity));
//        when(policyMapper.toPolicy(mockPolicyEntity)).thenReturn(mockPolicy);
//        when(policyOutputBoundary.convertToListPolicyOutputData(anyList())).thenReturn(mockListPolicyOutputData);
//
//        ListPolicyOutputData listPolicyOutputData = viewPolicyUseCaseInteraction.findAll();
//
//        assertNotNull(listPolicyOutputData);
//        assertEquals(mockListPolicyOutputData, listPolicyOutputData);
//        verify(policyRepository).findAllByIsActive(true);
//        verify(policyMapper).toPolicy(mockPolicyEntity);
//        verify(policyOutputBoundary).convertToListPolicyOutputData(anyList());
//    }
//}
