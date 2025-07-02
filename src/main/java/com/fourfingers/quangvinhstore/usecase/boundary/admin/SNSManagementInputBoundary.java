package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.account.SNSInputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.ListSNSOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface SNSManagementInputBoundary {
    ListSNSOutputData getAllSNSs();

    SNSOutputData save(SNSInputData snsInputData);

    SNSOutputData getSNS(String id);

    SNSOutputData delete(String id, UserDetails userDetails);
}
