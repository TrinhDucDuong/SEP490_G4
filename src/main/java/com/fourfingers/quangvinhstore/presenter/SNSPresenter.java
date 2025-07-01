package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.SNS;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.ListSNSOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SNSPresenter implements SNSManagementOutputBoundary {
    @Override
    public SNSOutputData convertToSNSOutputData(SNS sns) {
        return new SNSOutputData(sns);
    }

    @Override
    public ListSNSOutputData convertToListSNSOutputData(List<SNS> snss) {
        return new ListSNSOutputData(snss);
    }
}
