package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.infrastructure.repository.ActionLogRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ActionLogEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ActionType;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ReferenceType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ActionLogInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ActionLogInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActionLogUseCaseInteraction implements ActionLogInputBoundary {
    private final ActionLogRepository actionLogRepository;

    @Override
    public void logAction(ActionLogInputData actionLogInputData, UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        ActionLogEntity actionLogEntity = ActionLogEntity.builder()
                .actionTime(LocalDateTime.now())
                .actionType(ActionType.valueOf(actionLogInputData.getActionType()))
                .referenceId(actionLogInputData.getReferenceId())
                .referenceType(ReferenceType.valueOf(actionLogInputData.getReferenceType()))
                .performerId(accountEntity.getAccountId())
                .build();
        actionLogRepository.save(actionLogEntity);
    }
}
