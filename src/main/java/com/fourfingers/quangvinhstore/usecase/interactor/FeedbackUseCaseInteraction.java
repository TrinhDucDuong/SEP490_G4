package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Feedback;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.FeedbackMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.FeedbackRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.FeedbackInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.FeedbackOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.feedback.ListFeedbackOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class FeedbackUseCaseInteraction implements FeedbackInputBoundary {
    private final FeedbackOutputBoundary feedbackOutputBoundary;
    private final FeedbackRepository feedbackRepository;
    private final FeedbackMapper feedbackMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    @Override
    public ListFeedbackOutputData getAll() {
        return feedbackOutputBoundary.convertToFeedbackOutputData(
            feedbackRepository.findAllByIsActiveTrue()
                    .stream()
                    .map(feedbackEntity -> {
                        Feedback feedback = feedbackMapper.toModel(feedbackEntity);
                        feedback.setImages(
                                imageRepository.findAllByReferenceIdAndImageType(feedbackEntity.getFeedbackId(),
                                        ImageType.FEEDBACK)
                                        .stream()
                                        .map(imageMapper::toModel)
                                        .toList()
                        );
                        return feedback;
                    })
                    .toList()
        );
    }
}
