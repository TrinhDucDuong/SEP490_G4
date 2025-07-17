package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Policy;
import com.fourfingers.quangvinhstore.usecase.data.customer.PolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListPolicyOutputData;

import java.util.List;

public interface PolicyOutputBoundary {
    ListPolicyOutputData convertToListPolicyOutputData(List<Policy> policies);
    PolicyOutputData convertToPolicyOutputData(Policy policy);
}
