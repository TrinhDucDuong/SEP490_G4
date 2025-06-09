package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Policy;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.PolicyMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.PolicyRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.PolicyInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.PolicyOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.ListPolicyOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ViewPolicyUseCaseInteraction implements PolicyInputBoundary {
    private final PolicyRepository policyRepository;
    private final PolicyOutputBoundary policyOutputBoundary;
    private final PolicyMapper policyMapper;

    @Override
    public ListPolicyOutputData findAll() {
        return policyOutputBoundary.convertToListPolicyOutputData(
                List.of(policyRepository.findAllByIsActive(true)
                        .stream()
                        .map(policyMapper::toPolicy)
                        .toArray(Policy[]::new))
        );
    }

}
