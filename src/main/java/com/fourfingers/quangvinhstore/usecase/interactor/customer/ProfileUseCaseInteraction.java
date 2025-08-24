package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Profile;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.ProfileMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Implementation of ProfileInputBoundary for handling profile-related use cases
 *
 * @author LongLTHE170099
 * @author DuongTDHE171824
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProfileUseCaseInteraction implements ProfileInputBoundary {
    private final ProfileOutputBoundary profileOutputBoundary;
    private final ProfileMapper profileMapper;
    private final ProfileRepository profileRepository;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final AzureStorageBoundary azureStorageBoundary;
    private final AccountRepository accountRepository;

    /**
     * Retrieves the profile information for a given user
     *
     * @param userDetails The user details of the authenticated user
     * @return ProfileOutputData containing the user's profile information
     * @author LongLTHE170099
     * @author DuongTDHE171824
     */
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
        Optional<AccountEntity> accountToGetMail = accountRepository.findById(accountEntity.getAccountId());
        accountToGetMail.ifPresent(entity -> profile.setEmail(accountToGetMail.get().getEmail()));
        return profileOutputBoundary.convertToProfileOutputData(profile);
    }

    /**
     * Updates a user's profile information and profile image
     *
     * @param profileInputData The profile data to be updated
     * @param profileImage     The new profile image file
     * @param userDetails      The user details of the authenticated user
     * @return ProfileOutputData containing the updated profile information
     * @throws Exception If there's an error during profile update
     * @author LongLTHE170099
     * @author DuongTDHE171824
     */
    @Override
    @Transactional
    public ProfileOutputData update(ProfileInputData profileInputData,
                                    MultipartFile profileImage,
                                    UserDetails userDetails) throws Exception {
        AccountEntity accountEntity = (AccountEntity) userDetails;
        ProfileEntity profileEntity = profileRepository.findByAccount_AccountId(accountEntity.getAccountId())
                .orElseThrow(
                    () -> new RuntimeException("Profile not found")
                );
        Optional.ofNullable(profileInputData.getFirstName()).ifPresent(profileEntity::setFirstName);
        Optional.ofNullable(profileInputData.getLastName()).ifPresent(profileEntity::setLastName);
        Optional.ofNullable(profileInputData.getPhoneNumber()).ifPresent(profileEntity::setPhoneNumber);
        Optional.ofNullable(profileInputData.getBirthDate()).ifPresent(profileEntity::setBirthDate);
        Optional.ofNullable(profileInputData.getGender()).ifPresent(gender ->
                profileEntity.setGender(Gender.valueOf(gender))
        );
        profileEntity.setUpdatedAt(LocalDateTime.now());

        Optional<AccountEntity> accountToSetMail = accountRepository.findById(accountEntity.getAccountId());
        accountToSetMail.ifPresent(entity -> {
            entity.setEmail(profileInputData.getEmail());
            accountRepository.save(entity);
        });

        Profile profile = profileMapper.toModel(profileRepository.saveAndFlush(profileEntity));
        Optional<AccountEntity> accountToGetMail = accountRepository.findById(accountEntity.getAccountId());
        accountToGetMail.ifPresent(entity -> profile.setEmail(accountToGetMail.get().getEmail()));
        ImageEntity imageEntity = imageRepository.findByReferenceIdAndImageType(profileEntity.getProfileId(),
                ImageType.PROFILE).orElse(null);
        profile.setProfileImage(imageEntity == null ? new Image() : imageMapper.toModel(imageEntity));
        if(profileImage != null) {
            deletePrevImage(profileEntity);
            profile.setProfileImage(saveImage(profileEntity, profileImage));
        }
        return profileOutputBoundary.convertToProfileOutputData(profile);
    }

    /**
     * Saves a profile image to storage and database
     *
     * @param profileEntity The profile entity associated with the image
     * @param profileImage  The image file to be saved
     * @return Image model containing the saved image information
     * @throws Exception If there's an error during image saving
     * @author LongLTHE170099
     */
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

    /**
     * Deletes the previous profile image associated with the profile
     *
     * @param profileEntity The profile entity whose image needs to be deleted
     * @throws RuntimeException If there's an error during image deletion
     * @author LongLTHE170099
     * @author DuongTDHE171824
     */
    private void deletePrevImage(ProfileEntity profileEntity) {
        try {
            imageRepository.findByReferenceIdAndImageType(profileEntity.getProfileId(),
                    ImageType.PROFILE).ifPresent(imageRepository::delete);
        } catch (Exception e) {
            throw new RuntimeException("Xóa ảnh cũ thất bại: " + e.getMessage());
        }
    }

}
