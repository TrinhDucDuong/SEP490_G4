package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.input.policy.PolicyInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.PolicyOutputData;

public interface PolicyManagementInputBoundary {
    ListPolicyOutputData findAll();
    PolicyOutputData findById(String id);
    PolicyOutputData save(String id, PolicyInputData input);
    PolicyOutputData delete(String id);
}
