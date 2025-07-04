package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.account.ListStaffAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.account.StaffAccountOutputData;

public interface StaffAccountManagementInputBoundary {
    ListStaffAccountOutputData search(int pageNumber, int pageSize);
}
