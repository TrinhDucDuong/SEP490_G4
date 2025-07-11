package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackOutputData;

public interface FeedBackManagementInputBoundary {
    FeedbackOutputData create(FeedbackInputData feedbackInputData);
}
