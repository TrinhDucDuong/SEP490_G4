package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.QuestionForAiInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ResponseFromAiOutputData;

public interface ChatWithAiInputBoundary {
    ResponseFromAiOutputData getResponse(QuestionForAiInputData input);
}
