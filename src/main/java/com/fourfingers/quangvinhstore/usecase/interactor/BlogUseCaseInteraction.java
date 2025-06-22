package com.fourfingers.quangvinhstore.usecase.interactor;

import com.fourfingers.quangvinhstore.domain.model.Blog;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.BlogMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BlogRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.BlogInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.BlogOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.blog.ListBlogOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BlogUseCaseInteraction implements BlogInputBoundary {
    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;
    private final BlogOutputBoundary blogOutputBoundary;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    @Override
    public ListBlogOutputData getAll() {
        return blogOutputBoundary.convertToListBlogOutputData(
            blogRepository.findAllByIsActiveTrue()
                    .stream()
                    .map(blogEntity -> {
                        Blog blog = blogMapper.toModel(blogEntity);
                        blog.setImages(
                                imageRepository.findAllByReferenceIdAndImageType(blogEntity.getBlogId(),
                                        ImageType.BLOG)
                                        .stream()
                                        .map(imageMapper::toModel)
                                        .toList()
                        );
                        return blog;
                    })
                    .toList()
        );
    }
}
