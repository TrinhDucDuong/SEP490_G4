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

/**
 * Implementation of ActionLogInputBoundary for handling action logging use cases.
 * This class manages the creation and persistence of action logs in the system.
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActionLogUseCaseInteraction implements ActionLogInputBoundary {
    private final ActionLogRepository actionLogRepository;

    /**
     * Logs an action performed by a user in the system.
     * Creates and persists an ActionLogEntity based on the provided input data and user details.
     *
     * @param actionLogInputData The data containing information about the action to be logged
     * @param userDetails        The details of the user who performed the action
     * @author LongLTHE170099
     */
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
