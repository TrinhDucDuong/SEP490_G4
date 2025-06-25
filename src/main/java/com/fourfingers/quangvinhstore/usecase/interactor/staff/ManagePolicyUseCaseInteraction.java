package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.customer.Policy;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.PolicyMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.PolicyRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.PolicyEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.PolicyManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.PolicyOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.policy.PolicyInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.policy.PolicyOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManagePolicyUseCaseInteraction implements PolicyManagementInputBoundary {
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

    @Override
    public PolicyOutputData findById(String id) {
        try {
            Long policyId = Long.parseLong(id);
            PolicyEntity policyEntity = policyRepository.findById(policyId).orElse(null);
            if (policyEntity != null) {
                return policyOutputBoundary.convertToPolicyOutputData(policyMapper.toPolicy(policyEntity));
            } else {
                throw new RuntimeException("Policy not found");
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid policy id");
        }
    }

    @Override
    public PolicyOutputData save(String id, PolicyInputData inputData) {
        PolicyEntity policyEntity = PolicyEntity.builder()
                .policyName(inputData.getPolicyName())
                .policyDescription(inputData.getPolicyDescription())
                .isActive(true)
                .build();
        if(id!=null) {
            try {
                Long policyId = Long.parseLong(id);
                policyEntity.setPolicyId(policyId);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid policy id");
            }
        }
        Policy savedPolicy = policyMapper.toPolicy(policyRepository.save(policyEntity));
        return policyOutputBoundary.convertToPolicyOutputData(savedPolicy);
    }

    @Override
    public PolicyOutputData delete(String id) {
        try {
            Long policyId = Long.parseLong(id);
            PolicyEntity policyEntity = policyRepository.findById(policyId).orElse(null);
            if (policyEntity != null) {
                policyEntity.setIsActive(false);
                Policy deletedPolicy = policyMapper.toPolicy(policyRepository.save(policyEntity));
                return policyOutputBoundary.convertToPolicyOutputData(deletedPolicy);
            } else {
                throw new RuntimeException("Policy not found");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid policy id");
        }
    }
}
