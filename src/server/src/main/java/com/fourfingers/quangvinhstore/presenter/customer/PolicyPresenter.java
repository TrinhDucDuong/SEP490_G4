package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Policy;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.PolicyOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.PolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListPolicyOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PolicyPresenter implements PolicyOutputBoundary {
    @Override
    public ListPolicyOutputData convertToListPolicyOutputData(List<Policy> policies) {
        return new ListPolicyOutputData(policies);
    }

    @Override
    public PolicyOutputData convertToPolicyOutputData(Policy policy) {
        return new PolicyOutputData(policy);
    }
}
