package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyOutputData;

public interface PolicyManagementInputBoundary {
    ListPolicyOutputData findAll();
    PolicyOutputData findById(String id);
    PolicyOutputData save(String id, PolicyInputData input);
    PolicyOutputData delete(String id);
}
