package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Feedback;
import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.FeedbackOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.FeedbackOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListFeedbackOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FeedbackPresenter implements FeedbackOutputBoundary {

    @Override
    public ListFeedbackOutputData convertToFeedbackOutputData(List<Feedback> feedbacks) {
        return new ListFeedbackOutputData(feedbacks);
    }

    @Override
    public FeedbackOutputData convertToFeedbackOutputData(Feedback feedback, Store relatedStore) {
        return new FeedbackOutputData(feedback, relatedStore);
    }
}
