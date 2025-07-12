package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.account.SNSInputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.ListSNSOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface SNSManagementInputBoundary {
    ListSNSOutputData getAllSNSs(UserDetails userDetails);

    SNSOutputData save(SNSInputData snsInputData, UserDetails userDetails);

    SNSOutputData getSNS(Long id, UserDetails userDetails);

    SNSOutputData delete(Long id, UserDetails userDetails);
}
