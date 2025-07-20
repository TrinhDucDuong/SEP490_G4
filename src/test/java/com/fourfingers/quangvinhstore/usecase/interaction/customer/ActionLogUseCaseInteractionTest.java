package com.fourfingers.quangvinhstore.usecase.interaction.customer;

import com.fourfingers.quangvinhstore.infrastructure.repository.ActionLogRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ActionLogEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ActionType;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ReferenceType;
import com.fourfingers.quangvinhstore.usecase.data.customer.ActionLogInputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.ActionLogUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
public class ActionLogUseCaseInteractionTest {
    @InjectMocks
    private ActionLogUseCaseInteraction useCase;

    @Mock
    private ActionLogRepository actionLogRepository;

    private AccountEntity mockAccountEntity;

    @BeforeEach
    void setUp() {
        mockAccountEntity = AccountEntity.builder().accountId(1L).build();
    }

    @Test
    public void testSaveActionLog_ShouldSaveActionLog() {
        ActionLogInputData inputData = ActionLogInputData.builder()
                .actionType("VIEW")
                .referenceId(1L)
                .referenceType("PRODUCT")
                .build();
        UserDetails userDetails = (UserDetails) mockAccountEntity;

        useCase.logAction(inputData, userDetails);

        ArgumentCaptor<ActionLogEntity> captor = ArgumentCaptor.forClass(ActionLogEntity.class);
        verify(actionLogRepository, times(1)).save(captor.capture());

        ActionLogEntity savedLog = captor.getValue();
        assertNotNull(savedLog.getActionTime(), "Action time should be set");
        assertEquals(ActionType.VIEW, savedLog.getActionType());
        assertEquals(1L, savedLog.getReferenceId());
        assertEquals(ReferenceType.PRODUCT, savedLog.getReferenceType());
        assertEquals(1L, savedLog.getPerformerId());
    }
}
