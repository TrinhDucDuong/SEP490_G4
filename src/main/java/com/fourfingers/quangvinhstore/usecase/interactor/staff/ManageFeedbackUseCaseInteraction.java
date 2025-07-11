package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Feedback;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.FeedbackStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.StoreStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.FeedbackRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.StoreRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.FeedbackEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.StoreEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.FeedbackManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.FeedbackManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListFeedbackOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackOutputData;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageFeedbackUseCaseInteraction implements FeedbackManagementInputBoundary {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackStaffMapper feedbackStaffMapper;
    private final StoreRepository storeRepository;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final AzureStorageBoundary azureStorageBoundary;
    private final FeedbackManagementOutputBoundary feedbackManagementOutputBoundary;
    private final StoreStaffMapper storeStaffMapper;

    @Override
    public FeedbackOutputData create(FeedbackInputData feedbackInputData,
                                     List<MultipartFile> feedbackImages,
                                     UserDetails userDetails) throws Exception {
        StoreEntity relatedStore = storeRepository.findById(feedbackInputData.getStoreId()).orElseThrow(
                () -> new EntityNotFoundException("Store not found"));
        FeedbackEntity needToCreateFeedbackEntity = FeedbackEntity.builder()
                .feedbackTitle(feedbackInputData.getFeedbackTitle())
                .feedbackContent(feedbackInputData.getFeedbackContent())
                .store(relatedStore)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .createdBy((AccountEntity) userDetails)
                .build();
        FeedbackEntity createdFeedbackEntity = feedbackRepository.save(needToCreateFeedbackEntity);
        Feedback createdFeedback = feedbackStaffMapper.toModel(createdFeedbackEntity);
        createdFeedback.setFeedbackImages(saveFeedbackImages(feedbackImages, createdFeedbackEntity));
        return feedbackManagementOutputBoundary.convertToFeedbackOutputData(
                createdFeedback, storeStaffMapper.toModel(relatedStore)
        );
    }

    @Override
    public ListFeedbackOutputData getAll() {
        List<Feedback> feedbacks = feedbackRepository.findAllByIsActiveTrue()
                .stream()
                .map(feedbackEntity -> {
                    Feedback feedback = feedbackStaffMapper.toModel(feedbackEntity);
                    feedback.setFeedbackImages(getFeedbackImages(feedbackEntity));
                    return feedback;
                })
                .toList();
        return feedbackManagementOutputBoundary.convertToListFeedbackOutputData(feedbacks);
    }

    @Override
    public FeedbackOutputData update(String id, FeedbackInputData feedbackInputData, List<MultipartFile> feedbackImages,
                                     UserDetails userDetails) throws Exception {
        StoreEntity relatedStore = storeRepository.findById(feedbackInputData.getStoreId()).orElseThrow(
                () -> new EntityNotFoundException("Store not found"));
        FeedbackEntity needToUpdateFeedbackEntity = feedbackRepository.findById(Long.valueOf(id)).orElseThrow(
                () -> new EntityNotFoundException("Feedback not found")
        );
        needToUpdateFeedbackEntity.setFeedbackTitle(feedbackInputData.getFeedbackTitle());
        needToUpdateFeedbackEntity.setFeedbackContent(feedbackInputData.getFeedbackContent());
        needToUpdateFeedbackEntity.setUpdatedAt(LocalDateTime.now());
        needToUpdateFeedbackEntity.setUpdatedBy((AccountEntity) userDetails);
        needToUpdateFeedbackEntity.setStore(relatedStore);

        //Delete the old images
        deleteFeedbackImages(needToUpdateFeedbackEntity);

        //Save information
        FeedbackEntity updatedFeedbackEntity = feedbackRepository.save(needToUpdateFeedbackEntity);

        //save and get a list new images
        Feedback updatedFeedback = feedbackStaffMapper.toModel(updatedFeedbackEntity);
        updatedFeedback.setFeedbackImages(saveFeedbackImages(feedbackImages, needToUpdateFeedbackEntity));
        return feedbackManagementOutputBoundary.convertToFeedbackOutputData(
                updatedFeedback, storeStaffMapper.toModel(relatedStore)
        );
    }

    private List<Image> saveFeedbackImages(List<MultipartFile> feedbackImages, FeedbackEntity feedbackEntity)
            throws Exception {
        List<String> imageUrls = azureStorageBoundary.uploadMany(feedbackImages);
        List<ImageEntity> imageEntities = imageUrls.stream()
                .map(url -> ImageEntity.builder()
                        .imageType(ImageType.FEEDBACK)
                        .imageUrl(url)
                        .isActive(true)
                        .referenceId(feedbackEntity.getFeedbackId())
                        .build())
                .toList();
        return imageRepository.saveAll(imageEntities).stream().map(imageMapper::toModel).toList();
    }

    private List<Image> getFeedbackImages(FeedbackEntity feedbackEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(feedbackEntity.getFeedbackId(), ImageType.FEEDBACK)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }

    private void deleteFeedbackImages(FeedbackEntity feedbackEntity) {
        List<ImageEntity> imageEntities = imageRepository.findAllByReferenceIdAndImageType(
                feedbackEntity.getFeedbackId(),
                ImageType.FEEDBACK);
        List<String> imageUrls = imageEntities.stream().map(ImageEntity::getImageUrl).toList();
        azureStorageBoundary.deleteFile(imageUrls);
        imageRepository.deleteAll(imageEntities);
    }

}
