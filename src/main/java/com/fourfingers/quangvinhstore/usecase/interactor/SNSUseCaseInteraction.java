package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.SNSMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.SNSRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.SNSInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.ListSNSOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSUseCaseInteraction implements SNSInputBoundary {
    private final SNSRepository snsRepository;
    private final SNSMapper snsMapper;
    private final SNSManagementOutputBoundary snsManagementOutputBoundary;

    @Override
    public ListSNSOutputData getAllSNSs() {
        return snsManagementOutputBoundary.convertToListSNSOutputData(
                snsRepository.findAll()
                        .stream()
                        .map(snsMapper::toSNS)
                        .toList()
        );
    }
}
