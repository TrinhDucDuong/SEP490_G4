package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Policy;
import com.fourfingers.quangvinhstore.usecase.data.input.policy.PolicyInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.PolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.ListPolicyOutputData;

public interface PolicyInputBoundary {
    ListPolicyOutputData findAll();
    PolicyOutputData findById(String id);
    PolicyOutputData save(String id, PolicyInputData input);
    PolicyOutputData delete(String id);
}
