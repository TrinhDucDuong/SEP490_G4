package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Policy;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyOutputData;

import java.util.List;

public interface PolicyManagementOutputBoundary {
    ListPolicyOutputData convertToListPolicyOutputData(List<Policy> policies);
    PolicyOutputData convertToPolicyOutputData(Policy policy);
}
