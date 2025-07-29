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

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BlogUseCaseInteraction implements BlogInputBoundary {
    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;
    private final BlogOutputBoundary blogOutputBoundary;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

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

    private List<Image> getBlogImages(BlogEntity blogEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(blogEntity.getBlogId(),
                        ImageType.BLOG)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }

    private List<Long> getRelatedProductIds(BlogEntity blogEntity) {
        return blogEntity.getRelatedProducts().stream()
                .map(ProductEntity::getProductId)
                .toList();
    }
}
