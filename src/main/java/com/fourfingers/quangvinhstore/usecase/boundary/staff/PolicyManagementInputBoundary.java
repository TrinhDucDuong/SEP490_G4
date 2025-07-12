package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface PolicyManagementInputBoundary {
    ListPolicyOutputData findAll();
    PolicyOutputData findById(String id);
    PolicyOutputData save(String id, PolicyInputData input, UserDetails userDetails);
    PolicyOutputData delete(String id, UserDetails userDetails);
}
