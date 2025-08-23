package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.StaffAccount;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountDetailsOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountOutputData;

import java.util.List;

public interface StaffAccountManagementOutputBoundary {
    ListStaffAccountOutputData convertToListStaffAccountOutputData(List<StaffAccount> staffAccounts);
    StaffAccountOutputData convertToStaffAccountOutputData(StaffAccount staffAccount);
    StaffAccountDetailsOutputData convertToStaffAccountDetailsOutputData(Long staffAccountId, String staffName,
                                                                         Long totalProcessedOrder, Long totalRevenue,
                                                                         String workingAt, String phoneNumber,
                                                                         String username);
}
