package com.fourfingers.quangvinhstore.usecase.interaction.customer;

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
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProfileOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.customer.ProfileUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ProfileUseCaseInteractionTest {

    @Mock private ProfileOutputBoundary profileOutputBoundary;
    @Mock private ProfileMapper profileMapper;
    @Mock private ProfileRepository profileRepository;
    @Mock private ImageRepository imageRepository;
    @Mock private ImageMapper imageMapper;
    @Mock private AzureStorageBoundary azureStorageBoundary;
    @Mock private AccountRepository accountRepository;
    @Mock private MultipartFile profileImage;
    @Mock private UserDetails userDetails;

    @InjectMocks
    private ProfileUseCaseInteraction useCase;

    private AccountEntity mockAccount;
    private ProfileEntity mockProfileEntity;
    private Profile mockProfile;
    private ImageEntity mockImageEntity;
    private Image mockImage;

    @BeforeEach
    void setUp() {
        mockAccount = AccountEntity.builder()
                .accountId(1L)
                .email("test@example.com")
                .build();

        mockProfileEntity = ProfileEntity.builder()
                .profileId(10L)
                .account(mockAccount)
                .firstName("Test")
                .lastName("User")
                .phoneNumber("123456789")
                .gender(Gender.OTHER)
                .birthDate(LocalDate.of(2000, 1, 1))
                .build();

        mockProfile = new Profile();
        mockProfile.setEmail("test@example.com");

        mockImageEntity = ImageEntity.builder()
                .imageId(1L)
                .imageUrl("example.com/image.jpg")
                .imageType(ImageType.PROFILE)
                .referenceId(10L)
                .isActive(true)
                .build();

        mockImage = Image.builder().imageUrl("example.com/image.jpg").build();

        userDetails = (UserDetails) mockAccount;
    }

    @Test
    void testGetProfile_whenProfileExistsWithImage() {
        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(imageRepository.findByReferenceIdAndImageType(10L, ImageType.PROFILE))
                .thenReturn(Optional.of(mockImageEntity));
        when(profileMapper.toModel(mockProfileEntity)).thenReturn(mockProfile);
        when(imageMapper.toModel(mockImageEntity)).thenReturn(mockImage);
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(profileOutputBoundary.convertToProfileOutputData(any())).thenReturn(new ProfileOutputData());

        ProfileOutputData result = useCase.getProfile(userDetails);
        assertNotNull(result);
    }

    @Test
    void testGetProfile_whenProfileExistsWithoutImage() {
        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(imageRepository.findByReferenceIdAndImageType(10L, ImageType.PROFILE))
                .thenReturn(Optional.empty());
        when(profileMapper.toModel(mockProfileEntity)).thenReturn(mockProfile);
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(profileOutputBoundary.convertToProfileOutputData(any())).thenReturn(new ProfileOutputData());

        ProfileOutputData result = useCase.getProfile(userDetails);
        assertNotNull(result);
    }

    @Test
    void testGetProfile_whenImageRepositoryReturnsNull_shouldReturnProfileWithEmptyImage() {
        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(imageRepository.findByReferenceIdAndImageType(10L, ImageType.PROFILE))
                .thenReturn(Optional.empty());
        when(profileMapper.toModel(mockProfileEntity)).thenReturn(mockProfile);
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(profileOutputBoundary.convertToProfileOutputData(any())).thenReturn(new ProfileOutputData());

        ProfileOutputData result = useCase.getProfile(userDetails);
        assertNotNull(result);
    }


    @Test
    void testUpdate_whenImageEntityIsNull_shouldSetEmptyImage() throws Exception {
        ProfileInputData input = ProfileInputData.builder().email("test@example.com").build();

        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(profileRepository.saveAndFlush(any())).thenReturn(mockProfileEntity);
        when(profileMapper.toModel(any())).thenReturn(mockProfile);
        when(imageRepository.findByReferenceIdAndImageType(anyLong(), any())).thenReturn(Optional.empty());
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(profileOutputBoundary.convertToProfileOutputData(any())).thenReturn(new ProfileOutputData());

        ProfileOutputData result = useCase.update(input, null, userDetails);
        assertNotNull(result);
    }

    @Test
    void testUpdate_withProfileImage_shouldDeleteAndSaveImage() throws Exception {
        ProfileInputData input = ProfileInputData.builder().email("test@example.com").build();

        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(profileRepository.saveAndFlush(any())).thenReturn(mockProfileEntity);
        when(profileMapper.toModel(any())).thenReturn(mockProfile);
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(imageRepository.findByReferenceIdAndImageType(anyLong(), any()))
                .thenReturn(Optional.of(mockImageEntity)); // Line 112
        when(azureStorageBoundary.uploadSingle(any())).thenReturn("http://new.image.url"); // Line 113
        when(imageRepository.save(any())).thenReturn(mockImageEntity); // saveImage logic
        when(imageMapper.toModel(any())).thenReturn(mockImage); // Line 115
        when(profileOutputBoundary.convertToProfileOutputData(any())).thenReturn(new ProfileOutputData());

        ProfileOutputData result = useCase.update(input, profileImage, userDetails);
        assertNotNull(result);
        verify(imageRepository).delete(mockImageEntity);
        verify(imageRepository).save(any(ImageEntity.class));
    }

    @Test
    void testUpdate_whenProfileExists_withoutImageUpload() throws Exception {
        ProfileInputData input = ProfileInputData.builder()
                .firstName("New")
                .lastName("Name")
                .phoneNumber("999999999")
                .birthDate(LocalDate.of(1999, 9, 9))
                .gender("FEMALE")
                .email("updated@example.com")
                .build();

        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(profileMapper.toModel(any())).thenReturn(mockProfile);
        when(imageRepository.findByReferenceIdAndImageType(anyLong(), eq(ImageType.PROFILE)))
                .thenReturn(Optional.empty()); // ✅ Fix: return Optional.empty() instead of null
        when(profileRepository.saveAndFlush(any())).thenReturn(mockProfileEntity);
        when(profileOutputBoundary.convertToProfileOutputData(any())).thenReturn(new ProfileOutputData());

        ProfileOutputData result = useCase.update(input, null, userDetails);
        assertNotNull(result);
    }


    @Test
    void testUpdate_whenSaveImageThrowsException_shouldThrow() throws Exception {
        ProfileInputData input = ProfileInputData.builder()
                .gender("MALE")
                .email("updated@example.com")
                .build();

        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(profileMapper.toModel(any())).thenReturn(mockProfile);
        when(profileRepository.saveAndFlush(any())).thenReturn(mockProfileEntity);
        when(imageRepository.findByReferenceIdAndImageType(anyLong(), eq(ImageType.PROFILE))).thenReturn(null);
        when(azureStorageBoundary.uploadSingle(profileImage)).thenThrow(new RuntimeException("upload failed"));

        assertThrows(RuntimeException.class, () -> useCase.update(input, profileImage, userDetails));
    }

    @Test
    void testUpdate_whenProfileNotFound_shouldThrow() {
        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> useCase.update(new ProfileInputData(), null, userDetails));
    }

    @Test
    void testUpdate_withDeletePrevImageFailure_shouldStillThrow() {
        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));
        when(profileMapper.toModel(any())).thenReturn(mockProfile);
        when(profileRepository.saveAndFlush(any())).thenReturn(mockProfileEntity);
        when(imageRepository.findByReferenceIdAndImageType(anyLong(), eq(ImageType.PROFILE)))
                .thenThrow(new RuntimeException("failed"));

        assertThrows(RuntimeException.class, () -> useCase.update(new ProfileInputData(), profileImage, userDetails));
    }

    @Test
    void testGetProfile_whenAccountToGetMailIsEmpty_shouldNotFail() {
        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(imageRepository.findByReferenceIdAndImageType(10L, ImageType.PROFILE))
                .thenReturn(Optional.of(mockImageEntity));
        when(profileMapper.toModel(mockProfileEntity)).thenReturn(mockProfile);
        when(imageMapper.toModel(mockImageEntity)).thenReturn(mockImage);
        when(accountRepository.findById(anyLong())).thenReturn(Optional.empty());
        when(profileOutputBoundary.convertToProfileOutputData(any())).thenReturn(new ProfileOutputData());

        ProfileOutputData result = useCase.getProfile(userDetails);
        assertNotNull(result);
    }

    @Test
    void testUpdate_whenDeletePrevImageThrowsException_shouldThrowRuntimeException() throws Exception {
        ProfileInputData input = ProfileInputData.builder().email("test@example.com").build();

        when(profileRepository.findByAccount_AccountId(anyLong())).thenReturn(Optional.of(mockProfileEntity));
        when(profileRepository.saveAndFlush(any())).thenReturn(mockProfileEntity);
        when(profileMapper.toModel(any())).thenReturn(mockProfile);
        when(accountRepository.findById(anyLong())).thenReturn(Optional.of(mockAccount));

        when(imageRepository.findByReferenceIdAndImageType(anyLong(), any()))
                .thenThrow(new RuntimeException("DB error"));

        assertThrows(RuntimeException.class, () -> useCase.update(input, profileImage, userDetails));
    }

}
