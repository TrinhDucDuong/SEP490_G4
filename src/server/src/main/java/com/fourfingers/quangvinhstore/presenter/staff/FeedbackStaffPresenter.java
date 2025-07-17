package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Feedback;
import com.fourfingers.quangvinhstore.domain.model.staff.Store;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.FeedbackManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListFeedbackOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FeedbackStaffPresenter implements FeedbackManagementOutputBoundary {
    @Override
    public FeedbackOutputData convertToFeedbackOutputData(Feedback feedback, Store relatedStore) {
        return new FeedbackOutputData(feedback, relatedStore);
    }

    @Override
    public ListFeedbackOutputData convertToListFeedbackOutputData(List<Feedback> feedbacks) {
        return new ListFeedbackOutputData(feedbacks);
    }
}
