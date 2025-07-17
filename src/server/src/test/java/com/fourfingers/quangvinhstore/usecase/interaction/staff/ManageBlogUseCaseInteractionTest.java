package com.fourfingers.quangvinhstore.usecase.interaction.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Blog;
import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.BlogStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ProductStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BlogRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.BlogEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBlogOutputData;
import com.fourfingers.quangvinhstore.usecase.interactor.staff.ManageBlogUseCaseInteraction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class ManageBlogUseCaseInteractionTest {
    @InjectMocks
    private ManageBlogUseCaseInteraction useCase;

    @Mock
    private BlogRepository blogRepository;

    @Mock
    private BlogStaffMapper blogStaffMapper;

    @Mock
    private ProductStaffMapper productStaffMapper;

    @Mock
    private ImageMapper imageMapper;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private BlogManagementOutputBoundary blogManagementOutputBoundary;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AzureStorageBoundary azureStorageBoundary;

    private BlogEntity blogEntity;
    private ProductEntity relatedProductEntity;
    private ImageEntity imageEntity;
    private Blog blog;
    private Product product;
    private Image image;

    @BeforeEach
    void setUp() {
        imageEntity = ImageEntity.builder()
                .imageUrl("example.com/image.jpg")
                .imageType(ImageType.BLOG)
                .referenceId(1L)
                .build();

        relatedProductEntity = ProductEntity.builder()
                .productId(1L)
                .build();

        blog = Blog.builder()
                .blogId(1L)
                .build();

        BlogEntity blogEntity = BlogEntity.builder()
                .blogId(1L)
                .relatedProducts(List.of(relatedProductEntity))
                .build();

        product = Product.builder()
                .productId(1L)
                .build();

        imageEntity = ImageEntity.builder()
                .imageUrl("example.com/image.jpg")
                .build();

        image = Image.builder()
                .imageUrl("example.com/image.jpg")
                .build();
    }

    @Test
    void getAll_SuccessfullyReturnMappedOutput() {
        List<BlogEntity> mockBlogEntities = List.of(blogEntity);
        List<ProductEntity> mockRelatedProductEntities = List.of(relatedProductEntity);
        List<ImageEntity> mockImageEntities = List.of(imageEntity);
        List<Blog> mockExpectedBlogs = List.of(blog);

        //Mock test
        when(blogRepository.findAll()).thenReturn(mockBlogEntities);
        when(blogStaffMapper.toModel(blogEntity)).thenReturn(blog);

        when(imageRepository.findAllByReferenceIdAndImageType(blogEntity.getBlogId(), ImageType.BLOG))
                .thenReturn(mockImageEntities);

        when(productStaffMapper.toModel(relatedProductEntity)).thenReturn(product);
        blog.setRelatedProducts(List.of(product));
        blog.setBlogImages(List.of(image));

        ListBlogOutputData listBlogOutputData = new ListBlogOutputData();
        when(blogManagementOutputBoundary.convertToListBlogOutputData(mockExpectedBlogs)).thenReturn(listBlogOutputData);

        ListBlogOutputData actualOutputData = useCase.getAll();

        // --- 3. Assert: Verify interactions and results ---

        // Verify repository calls
        verify(blogRepository).findAll(); // Ensure findAll was called

        // Verify image repository calls for each blog
        verify(imageRepository).findAllByReferenceIdAndImageType(eq(blogEntity.getBlogId()), eq(ImageType.BLOG));

        //Verify mapper calls for each entity
        verify(blogStaffMapper).toModel(eq(blogEntity));
        verify(productStaffMapper).toModel(eq(relatedProductEntity));
        verify(imageMapper).toModel(eq(imageEntity));

        //Verify final output calls boundary
        verify(blogManagementOutputBoundary).convertToListBlogOutputData(eq(mockExpectedBlogs));
        // Verify the returned value
        assertEquals(listBlogOutputData, actualOutputData);
    }

}