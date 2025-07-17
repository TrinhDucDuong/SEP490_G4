package com.fourfingers.quangvinhstore.presenter.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.StaffAccount;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListStaffAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StaffAccountPresenter implements StaffAccountManagementOutputBoundary {
    @Override
    public ListStaffAccountOutputData convertToListStaffAccountOutputData(List<StaffAccount> staffAccounts) {
        return new ListStaffAccountOutputData(staffAccounts);
    }

    @Override
    public StaffAccountOutputData convertToStaffAccountOutputData(StaffAccount staffAccount) {
        return new StaffAccountOutputData(staffAccount);
    }
}
