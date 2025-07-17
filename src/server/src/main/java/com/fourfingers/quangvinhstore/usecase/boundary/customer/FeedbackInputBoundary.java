package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.FeedbackOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListFeedbackOutputData;

public interface FeedbackInputBoundary {
    ListFeedbackOutputData getAll();
    FeedbackOutputData getById(String id);
}
