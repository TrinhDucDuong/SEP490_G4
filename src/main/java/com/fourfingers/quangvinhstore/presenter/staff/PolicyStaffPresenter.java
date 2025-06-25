package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Policy;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.PolicyManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PolicyStaffPresenter implements PolicyManagementOutputBoundary {
    @Override
    public ListPolicyOutputData convertToListPolicyOutputData(List<Policy> policies) {
        return new ListPolicyOutputData(policies);
    }

    @Override
    public PolicyOutputData convertToPolicyOutputData(Policy policy) {
        return new PolicyOutputData(policy);
    }
}
