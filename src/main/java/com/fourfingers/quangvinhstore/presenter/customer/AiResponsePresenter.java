package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ChatWithAiOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ResponseFromAiOutputData;
import org.springframework.stereotype.Component;

@Component
public class AiResponsePresenter implements ChatWithAiOutputBoundary {
    @Override
    public ResponseFromAiOutputData convertToChatWithAiOutputData(String output) {
        return new ResponseFromAiOutputData(output);
    }
}
