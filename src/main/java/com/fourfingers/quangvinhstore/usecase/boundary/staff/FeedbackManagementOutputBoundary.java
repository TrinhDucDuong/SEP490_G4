package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Feedback;
import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListFeedbackOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackOutputData;

import java.util.List;

public interface FeedbackManagementOutputBoundary {
    FeedbackOutputData convertToFeedbackOutputData(Feedback feedback, Store relatedStore);

    ListFeedbackOutputData convertToListFeedbackOutputData(List<Feedback> feedbacks);
}
