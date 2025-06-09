package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.usecase.data.output.policy.ListPolicyOutputData;

public interface PolicyInputBoundary {
    ListPolicyOutputData findAll();
}
