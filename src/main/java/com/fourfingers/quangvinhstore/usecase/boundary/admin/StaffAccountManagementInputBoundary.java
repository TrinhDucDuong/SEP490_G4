package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;

public interface StaffAccountManagementInputBoundary {
    ListStaffAccountOutputData search(int pageNumber, int pageSize);
}
