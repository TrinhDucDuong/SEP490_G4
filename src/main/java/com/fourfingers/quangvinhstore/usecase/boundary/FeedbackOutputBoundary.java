package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Feedback;
import com.fourfingers.quangvinhstore.usecase.data.output.feedback.ListFeedbackOutputData;

import java.util.List;

public interface FeedbackOutputBoundary {
    ListFeedbackOutputData convertToFeedbackOutputData(List<Feedback> feedbacks);
}
