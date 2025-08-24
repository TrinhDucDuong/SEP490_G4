package com.fourfingers.quangvinhstore.usecase.interactor.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.customer.Blog;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.customer.BlogMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BlogRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.BlogEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.BlogTagEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.ProductEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BlogInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BlogOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListBlogOutputData;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Implementation of BlogInputBoundary for handling blog-related use cases
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BlogUseCaseInteraction implements BlogInputBoundary {
    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;
    private final BlogOutputBoundary blogOutputBoundary;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    /**
     * Retrieves all active blogs, optionally filtered by tag
     *
     * @param blogTag Optional tag to filter blogs
     * @return ListBlogOutputData containing all matching blogs
     * @author LongLTHE170099
     */
    @Override
    public ListBlogOutputData getAll(String blogTag) {
        List<BlogEntity> blogEntities;
        if (blogTag != null && !blogTag.isEmpty()) {
            blogEntities = blogRepository.findByBlogTags_tagNameAndIsActiveTrue(blogTag);
        } else {
            blogEntities = blogRepository.findAllByIsActiveTrue();
        }
        return blogOutputBoundary.convertToListBlogOutputData(
                blogEntities.stream()
                        .map(blogEntity -> Blog.builder()
                                .blogId(blogEntity.getBlogId())
                                .blogTitle(blogEntity.getBlogTitle())
                                .images(BlogUseCaseInteraction.this.getBlogImages(blogEntity))
                                .content(blogEntity.getContent())
                                .createdAt(blogEntity.getCreatedAt())
                                .tags(blogEntity.getBlogTags().stream().map(BlogTagEntity::getTagName).toList())
                                .build())
                        .toList()
        );
    }

    /**
     * Retrieves a specific blog by its ID
     *
     * @param id The ID of the blog to retrieve
     * @return BlogOutputData containing the blog details
     * @throws EntityNotFoundException if blog is not found
     * @author LongLTHE170099
     */
    @Override
    public BlogOutputData getById(String id) {
        Long blogId = Long.valueOf(id);
        BlogEntity blogEntity = blogRepository.findByBlogIdAndIsActiveTrue(blogId).orElseThrow(
                () -> new EntityNotFoundException(String.format("Blog with id %s not found", id))
        );
        Blog blog = blogMapper.toModel(blogEntity);
        blog.setImages(getBlogImages(blogEntity));
        blog.setRelatedProductIds(getRelatedProductIds(blogEntity));
        blog.setTags(blogEntity.getBlogTags().stream().map(BlogTagEntity::getTagName).toList());
        return blogOutputBoundary.convertToBlogOutputData(blog);
    }

    /**
     * Retrieves all images associated with a blog
     *
     * @param blogEntity The blog entity to get images for
     * @return List of Image objects associated with the blog
     * @author LongLTHE170099
     */
    private List<Image> getBlogImages(BlogEntity blogEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(blogEntity.getBlogId(),
                        ImageType.BLOG)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }

    /**
     * Retrieves IDs of products related to a blog
     *
     * @param blogEntity The blog entity to get related product IDs for
     * @return List of product IDs related to the blog
     * @author LongLTHE170099
     */
    private List<Long> getRelatedProductIds(BlogEntity blogEntity) {
        return blogEntity.getRelatedProducts().stream()
                .map(ProductEntity::getProductId)
                .toList();
    }
}
