package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Policy;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.PolicyStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.PolicyRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.PolicyEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.PolicyManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.PolicyManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListPolicyOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManagePolicyUseCaseInteraction implements PolicyManagementInputBoundary {
    private final PolicyRepository policyRepository;
    private final PolicyManagementOutputBoundary policyManagementOutputBoundary;
    private final PolicyStaffMapper policyMapper;

    @Override
    public ListPolicyOutputData findAll() {
        return policyManagementOutputBoundary.convertToListPolicyOutputData(
                List.of(policyRepository.findAllByIsActive(true)
                        .stream()
                        .map(policyMapper::toModel)
                        .toArray(Policy[]::new))
        );
    }

    @Override
    public PolicyOutputData findById(String id) {
        try {
            Long policyId = Long.parseLong(id);
            PolicyEntity policyEntity = policyRepository.findById(policyId).orElse(null);
            if (policyEntity != null) {
                return policyManagementOutputBoundary.convertToPolicyOutputData(policyMapper.toModel(policyEntity));
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
        Policy savedPolicy = policyMapper.toModel(policyRepository.save(policyEntity));
        return policyManagementOutputBoundary.convertToPolicyOutputData(savedPolicy);
    }

    @Override
    public PolicyOutputData delete(String id) {
        try {
            Long policyId = Long.parseLong(id);
            PolicyEntity policyEntity = policyRepository.findById(policyId).orElse(null);
            if (policyEntity != null) {
                policyEntity.setIsActive(false);
                Policy deletedPolicy = policyMapper.toModel(policyRepository.save(policyEntity));
                return policyManagementOutputBoundary.convertToPolicyOutputData(deletedPolicy);
            } else {
                throw new RuntimeException("Policy not found");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid policy id");
        }
    }
}
