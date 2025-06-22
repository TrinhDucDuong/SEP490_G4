package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Feedback;
import com.fourfingers.quangvinhstore.usecase.boundary.FeedbackOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.feedback.ListFeedbackOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FeedbackPresenter implements FeedbackOutputBoundary {

    @Override
    public ListFeedbackOutputData convertToFeedbackOutputData(List<Feedback> feedbacks) {
        return new ListFeedbackOutputData(feedbacks);
    }
}
