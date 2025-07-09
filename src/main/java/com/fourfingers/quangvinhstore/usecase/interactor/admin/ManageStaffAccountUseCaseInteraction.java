package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.domain.model.Account;
import com.fourfingers.quangvinhstore.domain.model.admin.StaffAccount;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.AccountMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStaffAccountUseCaseInteraction implements StaffAccountManagementInputBoundary {
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final StaffAccountManagementOutputBoundary staffAccountManagementOutputBoundary;

    @Override
    public ListStaffAccountOutputData search(int pageNumber, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNumber);
        List<StaffAccount> staffAccounts = getResult(
                accountRepository.getStaffAccountWithCondition(pageable).getContent()
        );
        return staffAccountManagementOutputBoundary.convertToListStaffAccountOutputData(staffAccounts);
    }

    private List<StaffAccount> getResult(List<Object[]> result) {
        return result.stream()
                .map(row -> {
                    Long accountId = ((Number) row[0]).longValue();
                    String staffName = (String) row[1];
                    Long totalProcessedOrder = row[2] != null ? ((Number) row[2]).longValue() : 0L;
                    Long totalRevenue = row[3] != null ? ((Number) row[3]).longValue() : 0L;

                    Account createdBy = null;
                    if (row[4] != null) {
                        Long createdById = ((Number) row[4]).longValue();
                        createdBy = accountRepository.findById(createdById)
                                .map(accountMapper::toAccount)
                                .orElse(null);
                    }

                    LocalDateTime createdAt = row[5] != null ? ((Timestamp) row[5]).toLocalDateTime() : null;
                    LocalDateTime updatedAt = row[7] != null ? ((Timestamp) row[7]).toLocalDateTime() : null;

                    Account updatedBy = null;
                    if (row[6] != null) {
                        Long updatedById = ((Number) row[6]).longValue();
                        updatedBy = accountRepository.findById(updatedById)
                                .map(accountMapper::toAccount)
                                .orElse(null);
                    }



                    return StaffAccount.builder()
                            .accountId(accountId)
                            .staffName(staffName)
                            .totalProcessedOrder(totalProcessedOrder)
                            .totalRevenue(totalRevenue)
                            .createdBy(createdBy)
                            .updatedBy(updatedBy)
                            .createdAt(createdAt)
                            .updatedAt(updatedAt)
                            .build();
                })
                .toList();
    }
}
