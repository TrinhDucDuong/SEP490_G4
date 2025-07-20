package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.AccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.ListAccountOutputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.AccountOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface AccountManagementInputBoundary {
    AccountOutputData getAccount(String id);
    ListAccountOutputData getAllAccounts();
    AccountOutputData delete(String id, UserDetails userDetails);
}
