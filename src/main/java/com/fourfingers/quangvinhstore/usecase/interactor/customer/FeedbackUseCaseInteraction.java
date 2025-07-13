package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Feedback;
import com.fourfingers.quangvinhstore.domain.model.customer.Store;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.FeedbackMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.StoreMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.FeedbackRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.FeedbackEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.FeedbackInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.FeedbackOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.FeedbackOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListFeedbackOutputData;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class FeedbackUseCaseInteraction implements FeedbackInputBoundary {
    private final FeedbackOutputBoundary feedbackOutputBoundary;
    private final FeedbackRepository feedbackRepository;
    private final FeedbackMapper feedbackMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final StoreMapper storeMapper;

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

    @Override
    public FeedbackOutputData getById(String id) {
        Long feedbackId = Long.valueOf(id);

        FeedbackEntity feedbackEntity = feedbackRepository.findById(feedbackId).orElseThrow(
                () -> new EntityNotFoundException(String.format("Feedback with id %s not found", id))
        );

        Feedback feedback = feedbackMapper.toModel(feedbackEntity);
        feedback.setImages(getFeedbackImages(feedbackEntity));
        Store relatedStore = storeMapper.toModel(feedbackEntity.getStore());

        return feedbackOutputBoundary.convertToFeedbackOutputData(feedback, relatedStore);
    }

    private List<Image> getFeedbackImages(FeedbackEntity feedbackEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(feedbackEntity.getFeedbackId(),
                        ImageType.FEEDBACK)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }
}
