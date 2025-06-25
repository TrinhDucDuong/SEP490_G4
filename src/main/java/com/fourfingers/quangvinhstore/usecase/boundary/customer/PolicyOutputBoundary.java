package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Policy;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.PolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.ListPolicyOutputData;

import java.util.List;

public interface PolicyOutputBoundary {
    ListPolicyOutputData convertToListPolicyOutputData(List<Policy> policies);
    PolicyOutputData convertToPolicyOutputData(Policy policy);
}
