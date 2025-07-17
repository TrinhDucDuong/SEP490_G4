//package com.fourfingers.quangvinhstore.usecase.interaction.admin;
//
//import com.fourfingers.quangvinhstore.domain.model.Account;
//import com.fourfingers.quangvinhstore.domain.model.admin.StaffAccount;
//import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
//import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
//import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
//import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementOutputBoundary;
//import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;
//import com.fourfingers.quangvinhstore.usecase.interactor.admin.ManageStaffAccountUseCaseInteraction;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.ArgumentCaptor;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.Pageable;
//
//import java.sql.Timestamp;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//@SpringBootTest
//public class ManageStaffAccountUseCaseInteractionTest {
//    @Mock
//    private AccountRepository accountRepository;
//
//    @Mock
//    private AccountMapper accountMapper;
//
//    @Mock
//    private StaffAccountManagementOutputBoundary outputBoundary;
//
//    @InjectMocks
//    private ManageStaffAccountUseCaseInteraction useCase;
//
//    private Account adminAccount;
//    private LocalDateTime now;
//
//    @BeforeEach
//    void setUp() {
//        now = LocalDateTime.now();
//        adminAccount = Account.builder().accountId(99L).build();
//    }
//
//    @Test
//    @DisplayName("search - Should return staff list when repository provide full data")
//    void testListStaffAccount_ShouldReturnListStaffAccountOutputData() {
//        // GIVEN
//        int pageNumber = 0;
//        int pageSize = 10;
//
//        // Dữ liệu giả lập trả về từ repository.getStaffAccountWithCondition
//        Object[] rows = new Object[]{
//                1L,                                     // accountId
//                "John Doe",                             // staffName
//                150L,                                   // totalProcessedOrder
//                5000000L,                               // totalRevenue
//                99L,                                    // createdById
//                Timestamp.valueOf(now.minusDays(1)),    // createdAt
//                99L,                                    // updatedById
//                Timestamp.valueOf(now)                  // updatedAt
//        };
//        List<Object[]> queryResult = new ArrayList<>();
//        queryResult.add(rows);
//        Page<Object[]> pagedResult = new PageImpl<>(queryResult);
//
//        // Giả lập entity và model cho createdBy/updatedBy
//        AccountEntity adminAccountEntity = new AccountEntity();
//        adminAccountEntity.setAccountId(99L);
//
//        // Mock các hành vi
//        when(accountRepository.getStaffAccountWithCondition(any(Pageable.class))).thenReturn(pagedResult);
//        when(accountRepository.findById(99L)).thenReturn(Optional.of(adminAccountEntity));
//        when(accountMapper.toAccount(adminAccountEntity)).thenReturn(adminAccount);
//        when(outputBoundary.convertToListStaffAccountOutputData(any()))
//                .thenReturn(new ListStaffAccountOutputData()); // Trả về đối tượng rỗng để test riêng biệt
//
//        // WHEN
//        ListStaffAccountOutputData result = useCase.search(pageNumber, pageSize);
//
//        // THEN
//        assertNotNull(result);
//
//        // Sử dụng ArgumentCaptor để bắt lấy đối số được truyền vào phương thức mock
//        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
//        verify(accountRepository).getStaffAccountWithCondition(pageableCaptor.capture());
//        assertEquals(pageNumber, pageableCaptor.getValue().getPageNumber());
//        assertEquals(pageSize, pageableCaptor.getValue().getPageSize());
//
//        verify(accountRepository, times(2)).findById(99L);
//        verify(accountMapper, times(2)).toAccount(adminAccountEntity);
//
//        ArgumentCaptor<List<StaffAccount>> staffAccountListCaptor = ArgumentCaptor.forClass(List.class);
//        verify(outputBoundary).convertToListStaffAccountOutputData(staffAccountListCaptor.capture());
//
//        List<StaffAccount> capturedStaffAccounts = staffAccountListCaptor.getValue();
//        assertEquals(1, capturedStaffAccounts.size());
//
//        StaffAccount capturedStaff = capturedStaffAccounts.getFirst();
//        assertEquals(1L, capturedStaff.getAccountId());
//        assertEquals("John Doe", capturedStaff.getStaffName());
//        assertEquals(150L, capturedStaff.getTotalProcessedOrder());
//        assertEquals(5000000L, capturedStaff.getTotalRevenue());
//        assertEquals(adminAccount, capturedStaff.getCreatedBy());
//        assertEquals(adminAccount, capturedStaff.getUpdatedBy());
//        assertEquals(now.minusDays(1), capturedStaff.getCreatedAt());
//        assertEquals(now, capturedStaff.getUpdatedAt());
//    }
//
//    @Test
//    @DisplayName("search - Should handle null values correctly from repository")
//    void search_ShouldHandleNullValuesCorrectly() {
//        // GIVEN
//        int pageNumber = 0;
//        int pageSize = 10;
//
//        // Dữ liệu giả lập chứa nhiều giá trị null
//        Object[] rowWithNulls = new Object[]{
//                2L,         // accountId
//                "Jane Doe", // staffName
//                null,       // totalProcessedOrder
//                null,       // totalRevenue
//                null,       // createdById
//                null,       // createdAt
//                null,       // updatedById
//                null        // updatedAt
//        };
//        List<Object[]> queryResult = new ArrayList<>();
//        queryResult.add(rowWithNulls);
//        Page<Object[]> pagedResult = new PageImpl<>(queryResult);
//
//        when(accountRepository.getStaffAccountWithCondition(any(Pageable.class))).thenReturn(pagedResult);
//        when(outputBoundary.convertToListStaffAccountOutputData(any()))
//                .thenReturn(new ListStaffAccountOutputData());
//
//        // WHEN
//        ListStaffAccountOutputData result = useCase.search(pageNumber, pageSize);
//
//        // THEN
//        assertNotNull(result);
//
//        // Xác minh rằng findById không bao giờ được gọi vì createdById/updatedById là null
//        verify(accountRepository, never()).findById(anyLong());
//        verify(accountMapper, never()).toAccount(any());
//
//        ArgumentCaptor<List<StaffAccount>> staffAccountListCaptor = ArgumentCaptor.forClass(List.class);
//        verify(outputBoundary).convertToListStaffAccountOutputData(staffAccountListCaptor.capture());
//
//        List<StaffAccount> capturedStaffAccounts = staffAccountListCaptor.getValue();
//        assertEquals(1, capturedStaffAccounts.size());
//
//        StaffAccount capturedStaff = capturedStaffAccounts.getFirst();
//        assertEquals(2L, capturedStaff.getAccountId());
//        assertEquals("Jane Doe", capturedStaff.getStaffName());
//        assertEquals(0L, capturedStaff.getTotalProcessedOrder()); // Mặc định là 0L
//        assertEquals(0L, capturedStaff.getTotalRevenue());      // Mặc định là 0L
//        assertNull(capturedStaff.getCreatedBy());
//        assertNull(capturedStaff.getUpdatedBy());
//        assertNull(capturedStaff.getCreatedAt());
//        assertNull(capturedStaff.getUpdatedAt());
//    }
//
//    @Test
//    @DisplayName("search - Should return empty list when repository returns empty content")
//    void search_ShouldReturnEmptyList_WhenRepositoryReturnsEmpty() {
//        // GIVEN
//        int pageNumber = 0;
//        int pageSize = 10;
//        Page<Object[]> emptyPage = new PageImpl<>(Collections.emptyList());
//
//        when(accountRepository.getStaffAccountWithCondition(any(Pageable.class))).thenReturn(emptyPage);
//        when(outputBoundary.convertToListStaffAccountOutputData(any()))
//                .thenReturn(new ListStaffAccountOutputData());
//
//        // WHEN
//        ListStaffAccountOutputData result = useCase.search(pageNumber, pageSize);
//
//        // THEN
//        assertNotNull(result);
//
//        ArgumentCaptor<List<StaffAccount>> staffAccountListCaptor = ArgumentCaptor.forClass(List.class);
//        verify(outputBoundary).convertToListStaffAccountOutputData(staffAccountListCaptor.capture());
//
//        assertTrue(staffAccountListCaptor.getValue().isEmpty());
//    }
//}
