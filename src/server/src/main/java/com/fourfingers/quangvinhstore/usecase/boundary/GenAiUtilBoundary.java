package com.fourfingers.quangvinhstore.usecase.boundary;

public interface GenAiUtilBoundary {
    String callGenAi(String info, String question);
    String getRecommendation(String productInfo, String actionLog);
}
