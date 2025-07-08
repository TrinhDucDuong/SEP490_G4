package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Blog;
import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.BlogStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ProductStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BlogRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ProductRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.BlogEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ImageEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.AzureStorageBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBlogOutputData;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBlogUseCaseInteraction implements BlogManagementInputBoundary {
    private final BlogRepository blogRepository;
    private final BlogStaffMapper blogStaffMapper;
    private final ProductStaffMapper productStaffMapper;
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;
    private final BlogManagementOutputBoundary blogManagementOutputBoundary;
    private final ProductRepository productRepository;
    private final AzureStorageBoundary azureStorageBoundary;

    @Override
    @Transactional
    public ListBlogOutputData getAll() {
        return blogManagementOutputBoundary.convertToListBlogOutputData(
                blogRepository.findAll()
                        .stream()
                        .map(blogEntity -> {
                            Blog blog = blogStaffMapper.toModel(blogEntity);
                            blog.setRelatedProducts(getRelatedProducts(blogEntity));
                            blog.setBlogImages(getBlogImage(blogEntity));
                            return blog;
                        })
                        .toList()
        );
    }

    @Override
    public BlogOutputData getById(String id) {
        Long blogId = Long.parseLong(id);
        BlogEntity blogEntity = blogRepository.findById(blogId).orElseThrow(
                () -> new EntityNotFoundException(String.format("Blog with id: %s not found", id))
        );
        Blog blog = blogStaffMapper.toModel(blogEntity);
        blog.setBlogImages(getBlogImage(blogEntity));
        blog.setRelatedProducts(getRelatedProducts(blogEntity));
        return blogManagementOutputBoundary.convertToBlogOutputData(blog);
    }

    @Override
    public BlogOutputData delete(String id, UserDetails userDetails) {
        AccountEntity performingDeletingAccountEntity = (AccountEntity) userDetails;
        BlogEntity needToDeleteBlog = blogRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException(String.format("Blog with id: %s not found", id))
        );
        needToDeleteBlog.setIsActive(false);
        needToDeleteBlog.setUpdatedBy(performingDeletingAccountEntity);
        needToDeleteBlog.setUpdatedAt(LocalDateTime.now());
        blogRepository.save(needToDeleteBlog);
        return blogManagementOutputBoundary.convertToBlogOutputData(
                blogStaffMapper.toModel(needToDeleteBlog)
        );
    }

    @Override
    @Transactional
    public BlogOutputData create(BlogInputData blogInputData, UserDetails userDetails, List<MultipartFile> blogImages) throws Exception {
        List<ProductEntity> relatedProducts = new ArrayList<>();

        if (!blogInputData.getRelatedProductIds().isEmpty()) {
            relatedProducts = productRepository.findAllByIsActiveTrueAndProductIdIn(
                    blogInputData.getRelatedProductIds()
            );
        }

        BlogEntity blogEntity = BlogEntity.builder()
                .blogTitle(blogInputData.getBlogTitle())
                .content(blogInputData.getContent())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .createdBy((AccountEntity) userDetails)
                .relatedProducts(relatedProducts)
                .build();
        Blog blog = blogStaffMapper.toModel(blogRepository.saveAndFlush(blogEntity));
        if (!blogImages.isEmpty()) {
            blog.setBlogImages(saveBlogImages(blog.getBlogId(), blogImages));
        }
        return blogManagementOutputBoundary.convertToBlogOutputData(blog);

    }

    @Override
    public BlogOutputData update(BlogInputData blogInputData, UserDetails userDetails, List<MultipartFile> blogImages,
                                 String id) throws Exception {
        Long blogId = Long.parseLong(id);
        BlogEntity blogEntity = blogRepository.findById(blogId).orElseThrow(
                () -> new EntityNotFoundException(String.format("Blog with id: %s not found", id))
        );

        List<ProductEntity> newRelatedProducts = new ArrayList<>();

        //Get a new related product
        if(!blogInputData.getRelatedProductIds().isEmpty()) {
            newRelatedProducts = productRepository.findAllByIsActiveTrueAndProductIdIn(
                    blogInputData.getRelatedProductIds()
            );
        }

        blogEntity.getRelatedProducts().clear();
        blogEntity.getRelatedProducts().addAll(newRelatedProducts);

        blogEntity.setBlogTitle(blogInputData.getBlogTitle());
        blogEntity.setContent(blogInputData.getContent());
        blogEntity.setUpdatedAt(LocalDateTime.now());
        blogEntity.setUpdatedBy((AccountEntity) userDetails);

        //Save blog information
        Blog updatedBlog = blogStaffMapper.toModel(blogRepository.saveAndFlush(blogEntity));

        //Delete and save new blog images
        if (!blogImages.isEmpty()) {
            deleteOldBlogImages(blogId);
            updatedBlog.setBlogImages(saveBlogImages(blogId, blogImages));
        }
        return blogManagementOutputBoundary.convertToBlogOutputData(updatedBlog);
    }

    @Override
    public BlogOutputData unDelete(String id, UserDetails userDetails) {
        AccountEntity performingUnDeletingAccountEntity = (AccountEntity) userDetails;
        BlogEntity needToUnDeleteBlog = blogRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException(String.format("Blog with id: %s not found", id))
        );
        needToUnDeleteBlog.setIsActive(true);
        needToUnDeleteBlog.setUpdatedBy(performingUnDeletingAccountEntity);
        needToUnDeleteBlog.setUpdatedAt(LocalDateTime.now());
        BlogEntity savedBlogEntity = blogRepository.save(needToUnDeleteBlog);
        return blogManagementOutputBoundary.convertToBlogOutputData(
                blogStaffMapper.toModel(savedBlogEntity)
        );
    }

    private List<Product> getRelatedProducts(BlogEntity blogEntity) {
        return blogEntity.getRelatedProducts().stream()
                .map(productStaffMapper::toModel)
                .toList();
    }

    private List<Image> getBlogImage(BlogEntity blogEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(blogEntity.getBlogId(), ImageType.BLOG)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }

    private List<Image> saveBlogImages(Long blogId, List<MultipartFile> images) throws Exception {
        List<String> imageUrls = azureStorageBoundary.uploadMany(images);
        List<ImageEntity> imageEntities = imageUrls
                .stream()
                .map(imageUrl -> ImageEntity.builder()
                        .referenceId(blogId)
                        .imageType(ImageType.BLOG)
                        .imageUrl(imageUrl)
                        .isActive(true)
                        .build())
                .toList();
        return imageRepository.saveAll(imageEntities).stream().map(imageMapper::toModel).toList();
    }

    private void deleteOldBlogImages(Long blogId) {
        List<ImageEntity> oldBlogImages = imageRepository.findAllByReferenceIdAndImageType(blogId, ImageType.BLOG);
        List<String> oldBlogImageUrls = oldBlogImages.stream().map(ImageEntity::getImageUrl).toList();
        azureStorageBoundary.deleteFile(oldBlogImageUrls);
        imageRepository.deleteAll(oldBlogImages);
    }
}
