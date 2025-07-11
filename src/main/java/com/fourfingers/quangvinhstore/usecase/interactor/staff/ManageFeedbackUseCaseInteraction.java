package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.FeedBackManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageFeedbackUseCaseInteraction implements FeedBackManagementInputBoundary {
    @Override
    public FeedbackOutputData create(FeedbackInputData feedbackInputData) {
        return null;
    }
}
