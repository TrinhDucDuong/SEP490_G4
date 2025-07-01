package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.domain.model.SNS;
import com.fourfingers.quangvinhstore.usecase.data.auth.ListSNSOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSOutputData;

import java.util.List;

public interface SNSManagementOutputBoundary {
    SNSOutputData convertToSNSOutputData(SNS sns);
    ListSNSOutputData convertToListSNSOutputData(List<SNS> snss);
}
