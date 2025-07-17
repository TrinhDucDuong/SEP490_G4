package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface StaffAccountManagementInputBoundary {
    ListStaffAccountOutputData search(int pageNumber, int pageSize);

    StaffAccountOutputData create(StaffAccountInputData staffAccountInputData, UserDetails userDetails);

    StaffAccountOutputData getById(String id);

    void delete(String id, UserDetails userDetails);

    void unDelete(String id, UserDetails userDetails);
}
