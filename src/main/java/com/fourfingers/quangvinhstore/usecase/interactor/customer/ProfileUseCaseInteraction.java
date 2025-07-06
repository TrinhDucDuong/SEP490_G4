package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Profile;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProfileMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProfileRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProfileEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.Gender;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProfileInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProfileOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProfileUseCaseInteraction implements ProfileInputBoundary {
    private final ProfileOutputBoundary profileOutputBoundary;
    private final ProfileMapper profileMapper;
    private final ProfileRepository profileRepository;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final AzureStorageBoundary azureStorageBoundary;

    @Override
    public ProfileOutputData getProfile(UserDetails userDetails) {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        ProfileEntity profileEntity = profileRepository.findByAccount_AccountId(accountEntity.getAccountId())
                .orElse(null);
        if(profileEntity == null) {
            return profileOutputBoundary.convertToProfileOutputData(new Profile());
        }
        ImageEntity imageEntity = imageRepository.findByReferenceIdAndImageType(profileEntity.getProfileId(),
                        ImageType.PROFILE).orElse(null);
        Profile profile = profileMapper.toModel(profileEntity);
        profile.setProfileImage(
                imageEntity == null ? new Image() : imageMapper.toModel(imageEntity)
        );
        return profileOutputBoundary.convertToProfileOutputData(profile);
    }

    @Override
    public ProfileOutputData update(ProfileInputData profileInputData,
                                    MultipartFile profileImage,
                                    UserDetails userDetails) throws Exception {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        ProfileEntity profileEntity = profileRepository.findByAccount_AccountId(accountEntity.getAccountId())
                .orElseThrow(
                    () -> new RuntimeException("Profile not found")
                );

        //delete prev image
        if(profileImage != null) {
            deletePrevImage(profileEntity);
        }

        profileEntity.setFirstName(profileInputData.getFirstName());
        profileEntity.setLastName(profileInputData.getLastName());
        profileEntity.setEmail(profileInputData.getEmail());
        profileEntity.setPhoneNumber(profileInputData.getPhoneNumber());
        profileEntity.setBirthDate(profileInputData.getBirthDate());
        profileEntity.setGender(Gender.valueOf(profileInputData.getGender()));
        profileEntity.setUpdatedAt(LocalDateTime.now());
        Profile profile = profileMapper.toModel(profileRepository.saveAndFlush(profileEntity));
        if(profileImage != null) {
            profile.setProfileImage(saveImage(profileEntity, profileImage));
        }
        return profileOutputBoundary.convertToProfileOutputData(profile);
    }

    private Image saveImage(ProfileEntity profileEntity, MultipartFile profileImage) throws Exception {
        String imageUrl = azureStorageBoundary.uploadSingle(profileImage);
        return imageMapper.toModel(imageRepository.save(
                ImageEntity.builder()
                        .imageType(ImageType.PROFILE)
                        .referenceId(profileEntity.getProfileId())
                        .imageUrl(imageUrl)
                        .isActive(true)
                        .build()
        ));
    }

    private void deletePrevImage(ProfileEntity profileEntity) {
        imageRepository.findByReferenceIdAndImageType(profileEntity.getProfileId(),
                ImageType.PROFILE).ifPresent(imageRepository::delete);
    }
}
