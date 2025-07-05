package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ResponseFromAiOutputData;

public interface ChatWithAiOutputBoundary {
    ResponseFromAiOutputData convertToChatWithAiOutputData(String output);
}
