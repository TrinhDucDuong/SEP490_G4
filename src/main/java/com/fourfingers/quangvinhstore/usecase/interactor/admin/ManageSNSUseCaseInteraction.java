package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.adapter.exception.AccountNotFoundException;
import com.fourfingers.quangvinhstore.domain.model.SNS;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.SNSMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.SNSRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.SNSEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.account.SNSInputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.ListSNSOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageSNSUseCaseInteraction implements SNSManagementInputBoundary {
    private final SNSRepository snsRepository;
    private final SNSMapper snsMapper;
    private final SNSManagementOutputBoundary snsManagementOutputBoundary;


    @Override
    public ListSNSOutputData getAllSNSs() {
        return snsManagementOutputBoundary.convertToListSNSOutputData(
                snsRepository.findAllByIsActiveTrue()
                        .stream()
                        .map(snsMapper::toSNS)
                        .toList()
        );
    }

    @Override
    public SNSOutputData save(SNSInputData snsInputData) {
        SNSEntity snsEntity = SNSEntity.builder()
                .snsId(snsInputData.getSnsId())
                .snsName(snsInputData.getSnsName())
                .snsUrl(snsInputData.getSnsUrl())
                .snsChatUrl(snsInputData.getSnsChatUrl())
                .isActive(true)
                .build();
        SNS savedSNS = snsMapper.toSNS(snsRepository.save(snsEntity));
        return snsManagementOutputBoundary.convertToSNSOutputData(savedSNS);
    }

    @Override
    public SNSOutputData getSNS(String id) {
        try {
            Long snsId = Long.valueOf(id);
            SNSEntity snsEntity = snsRepository.findBySnsIdAndIsActiveTrue(snsId).orElseThrow(
                    () -> new AccountNotFoundException("SNS not found")
            );
            return snsManagementOutputBoundary.convertToSNSOutputData(
                    snsMapper.toSNS(snsEntity)
            );
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid SNS id");
        }
    }

    @Override
    public SNSOutputData delete(String id, UserDetails userDetails) {
        try {
            Long snsId = Long.valueOf(id);
            SNSEntity snsEntity = snsRepository.findById(snsId).orElseThrow(
                    () -> new AccountNotFoundException("SNS not found")
            );
            snsEntity.setActive(false);
            return snsManagementOutputBoundary.convertToSNSOutputData(
                snsMapper.toSNS(snsRepository.save(snsEntity))
            );
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid SNS id");
        }
    }
}
