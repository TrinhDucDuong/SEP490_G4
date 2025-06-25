package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Feedback;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListFeedbackOutputData;

import java.util.List;

public interface FeedbackOutputBoundary {
    ListFeedbackOutputData convertToFeedbackOutputData(List<Feedback> feedbacks);
}
